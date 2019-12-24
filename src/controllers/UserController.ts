import {Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security} from 'tsoa'
import {ICreateUserDto, ISearchAndFilter, IUser, User} from '../models/User';
import {Types} from 'mongoose'
import * as express from 'express';
import * as log4js from 'log4js'
import {ServerError} from "../utils";
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
        return this.paginate(page, limit, sortAsc, fieldSort);
    }

    @Security('jwt', ['admin'])
    @Post('filter')
    public async filter(@Body() body: ISearchAndFilter, @Query() page: number = 1,
                        @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        try {
            return this.paginate(page, limit, sortAsc, fieldSort, body);
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
            if (!user) this.handleError(null);
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

    public async paginate(page: number = 1, limit: number = 10, sortAsc: boolean = true, fieldSort: string = '_id',
                          searchAndFilter: ISearchAndFilter = {query: {}, filter: {}})
        : Promise<IPaginateResult<IUser>> {
        const sort = {};
        sort[fieldSort] = sortAsc ? 1 : -1;
        try {
            return await User.paginate(searchAndFilter.query, {
                page: page,
                limit: limit,
                sort: sort,
                select: searchAndFilter.filter
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        console.error(error);
        logger.error(error);
        const invalidId = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
        if (!error || error.message == invalidId) {
            throw new ServerError(404);
        } else if (error.name === 'MongoError' && error.code === 11000) {
            throw new ServerError(409);
        } else {
            throw new ServerError(error.message, error.stack);
        }
    }
}