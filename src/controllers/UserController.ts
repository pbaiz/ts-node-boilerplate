import {Controller, Route, Request, Response, Get, Post, Put, Delete, Security, Body} from 'tsoa'
import {User, IUser, ICreateUserDto} from '../models/User';
import {Types} from 'mongoose'
import * as express from 'express';
import * as log4js from 'log4js'
import {InternalServerError, ServerError} from "../utils";

const logger = log4js.getLogger("UserController");

export interface ErrorResponseModel {
    status: number;
    message: string;
}

@Route('api/v1/user/')
export class UserController extends Controller {

    @Security('jwt')
    @Get('me')
    public async getMe(@Request() request): Promise<IUser> {
        try {
            const objectId = Types.ObjectId(request.user.id);
            let user = await User.findById(objectId);
            return user;
        } catch (error) {
            this.handleError(request, error);
        }
    }

    @Security('jwt', ['admin'])
    @Get()
    public async getAll(@Request() request: express.Request): Promise<IUser[]> {
        try {
            return await User.find();
        } catch (error) {
            this.handleError(request, error);
        }
    }

    @Security('jwt', ['admin'])
    @Get('{id}')
    public async get(id: string, @Request() request: express.Request): Promise<IUser> {
        try {
            const objectId = Types.ObjectId(id);
            let user = await User.findById(objectId);
            if(!user) throw null;
            return user;
        } catch (error) {
            this.handleError(request, error);
        }
    }

    @Security('jwt', ['admin'])
    @Post()
    public async create(@Body() body: ICreateUserDto, @Request() request: express.Request): Promise<IUser> {
        try {
            return await User.create(body);
        } catch (error) {
            console.error(error);
            if (error) {
                this.handleError(request, error);
            }
        }
    }

    @Security('jwt', ['admin'])
    @Put('{id}')
    public async update(id: string, @Body() body: IUser, @Request() request: express.Request): Promise<IUser> {
        try {
            return await User.findOneAndUpdate(id, body);
        } catch (error) {
            this.handleError(request, error);
        }
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async delete(id: string, @Body() body: IUser, @Request() request: express.Request): Promise<IUser> {
        try {
            return await User.findByIdAndRemove(id);
        } catch (error) {
            this.handleError(request, error);
        }
    }

    private handleError(request: express.Request, error: any){
        console.error(error);
        logger.error(error);
        if (!error || error.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
            let errorName = 'UserNotFound';
            let internalErrors = [new InternalServerError(1100, errorName, error.message, error.stack)];
            throw new ServerError(404, internalErrors);
            // request.res.status(404).send(errorResponseModel).end();
        } else if (error.name === 'MongoError' && error.code === 11000) {
            // const modal = {} as ErrorResponseModel;
            const errorResponseModel: ErrorResponseModel = {
                message: 'user_already_exist',
                status: 422
            };
            request.res.status(422).send(errorResponseModel).end();
        } else {
            // throw new ServerError('this is a error', 500, ErrorType.Unknown);
            // throw new ServerError('this is a message', HttpStatusCode.NotFound, ErrorType.Unknown)
            // request.res.status(500).send().end();
        }
    }
}