import {Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security} from 'tsoa'
import {IUserCreateDto, ISearchAndFilter, IUserUpdateDto, IUser} from '../models/User';
import {IPaginateResult} from "../interfaces/miscInterfaces";
import {UserService} from "../services/UserService";
import {ServerError} from "../utils";

@Route('api/v1/user/')
export class UserController extends Controller {

    @Security('jwt')
    @Get('me')
    public async getMe(@Request() request): Promise<IUser> {
        try {

        } catch (error) {
            throw error;
        }
        return await new UserService().getMe(request);
    }

    @Security('jwt', ['admin'])
    @Get()
    public async getAll(@Query() page: number = 1, @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        try {

        } catch (error) {
            throw error;
        }
        return await new UserService().paginate(page, limit, sortAsc, fieldSort);
    }

    @Security('jwt', ['admin'])
    @Post('filter')
    public async filter(@Body() body: ISearchAndFilter, @Query() page: number = 1,
                        @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        try {

        } catch (error) {
            throw error;
        }
        return await new UserService().paginate(page, limit, sortAsc, fieldSort, body);
    }

    @Security('jwt', ['admin'])
    @Get('{id}')
    public async get(id: string): Promise<IUser> {
        return await new UserService().get(id);
    }

    @Security('jwt', ['admin'])
    @Post()
    public async create(@Body() body: IUserCreateDto): Promise<IUser> {
        return await new UserService().create(body);
    }

    @Security('jwt', ['admin'])
    @Put('{id}')
    public async update(id: string, @Body() body: IUserUpdateDto): Promise<IUser> {
        // throw new ServerError(500);
        return await new UserService().update(id, body as IUser);
        // try {
        //     return await new UserService().update(id, body as IUser);
        // } catch (error) {
        //     throw error;
        // }

    }

    @Security('jwt', ['admin'])
    @Delete('{id}')
    public async delete(id: string): Promise<IUser> {
        return await new UserService().delete(id);
    }
}