import {Controller, Route, Request, Response, Get, Post, Put, Delete, Security, Body} from 'tsoa'
import {User, IUser, ICreateUserDto} from '../models/User';
import {Types} from 'mongoose'
import * as log4js from 'log4js'
import * as express from 'express';

let logger = log4js.getLogger("UserController");

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
            const errorResponseModel: ErrorResponseModel = {
                message: 'User not found!',
                status: 404
            };
            request.res.status(404).send(errorResponseModel).end();
        } else if (error.name === 'MongoError' && error.code === 11000) {
            // const modal = {} as ErrorResponseModel;
            const errorResponseModel: ErrorResponseModel = {
                message: 'User already exist!',
                status: 422
            };
            request.res.status(422).send(errorResponseModel).end();
        } else {
            request.res.status(500).send().end();
        }
    }
}