import {Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security, Tags} from 'tsoa'
import {IUser, IUserCreateDto, IUserUpdateDto} from '../repositories/UserRepository';
import {IPaginateResult, ISearchAndFilter} from "../interfaces/miscInterfaces";
import {UserService} from "../services/UserService";

@Route('api/v1/user/')
@Tags('User')
export class UserController extends Controller {

    @Security('Bearer')
    @Get('me')
    public async getMe(@Request() request): Promise<IUser> {
        return await new UserService().getMe(request);
    }

    @Security('Bearer', ['admin'])
    @Get()
    public async getAll(@Query() page: number = 1, @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        return await new UserService().paginate(page, limit, sortAsc, fieldSort);
    }

    @Security('Bearer', ['admin'])
    @Post('filter')
    public async filter(@Body() body: ISearchAndFilter, @Query() page: number = 1,
                        @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IUser>> {
        return await new UserService().paginate(page, limit, sortAsc, fieldSort, body);
    }

    @Security('Bearer', ['admin'])
    @Get('{id}')
    public async get(id: string): Promise<IUser> {
        return await new UserService().get(id);
    }

    @Security('Bearer', ['admin'])
    @Post()
    public async create(@Body() body: IUserCreateDto): Promise<IUser> {
        return await new UserService().create(body);
    }

    @Security('Bearer', ['admin'])
    @Put('{id}')
    public async update(id: string, @Body() body: IUserUpdateDto): Promise<IUser> {
        return await new UserService().update(id, body as IUser);
    }

    @Security('Bearer', ['admin'])
    @Delete('{id}')
    public async delete(id: string): Promise<IUser> {
        return await new UserService().delete(id);
    }
}