import {Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security} from 'tsoa'
import {ICreateUserDto, ISearchAndFilter, IUser, User} from '../models/User';
import {Types} from 'mongoose'
import * as express from 'express';
import * as log4js from 'log4js'
import {filterByKeys, ServerError} from "../utils";
import {IPaginateResult} from "../interfaces/miscInterfaces";

const logger = log4js.getLogger("UserController");

@Route('api/v1/user/')
export class UserController extends Controller {

    @Security('jwt')
    @Get('me')
    public async getMe(@Request() request): Promise<IUser> {
        try {
            const objectId = Types.ObjectId(request.user.id);
            return await User.findById(objectId);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Security('jwt', ['admin'])
    @Get()
    public async getAll(@Query() page: number = 1, @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        try {
            const sort = {};
            sort[fieldSort] = sortAsc ? 1: -1;

            return await User.paginate({}, {
                page: page,
                limit: limit,
                sort: sort,
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    @Security('jwt', ['admin'])
    @Post('search')
    public async search(@Body() body: any, @Query() page: number = 1,
                        @Query() limit: number = 10,  @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        try {
            return await User.paginate(body, {page: page, limit: limit});
        } catch (error) {
            this.handleError(error);
        }
    }

    @Security('jwt', ['admin'])
    @Post('filter')
    public async filter(@Body() body: ISearchAndFilter, @Query() page: number = 1,
                        @Query() limit: number = 10,  @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<any> {
        try {
            let paginated: any = await User.paginate(body.search, {page: page, limit: limit});
            paginated.docs = paginated.docs.map(d=> filterByKeys(d, body.search));

            return paginated;
        } catch (error) {
            this.handleError(error);
        }
    }

    @Security('jwt', ['admin'])
    @Get('{id}')
    public async get(id: string, @Request() request: express.Request): Promise<IUser> {
        try {
            const objectId = Types.ObjectId(id);
            let user = await User.findById(objectId);
            if(!user) this.handleError(null);
            return user;
        } catch (error) {
            this.handleError(error);
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
                this.handleError(error);
            }
        }
    }

    @Security('jwt', ['admin'])
    @Put('{id}')
    public async update(id: string, @Body() body: IUser, @Request() request: express.Request): Promise<IUser> {
        try {
            return await User.findOneAndUpdate(id, body);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async delete(id: string, @Body() body: IUser, @Request() request: express.Request): Promise<IUser> {
        try {
            return await User.findByIdAndRemove(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any){
        console.error(error);
        logger.error(error);
        if (!error || error.message == 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
            throw new ServerError(404);
        } else if (error.name === 'MongoError' && error.code === 11000) {
            throw new ServerError(409);
        } else {
            throw new ServerError(error.message, error.stack);
        }
    }
}