import {Body, Controller, Delete, Get, Post, Put, Query, Request, Route, Security, Tags} from 'tsoa'
import {IPlace, IPlaceCreateDto, IPlaceUpdateDto} from '../repositories/PlaceRepository';
import {IPaginateResult, ISearchAndFilter} from "../interfaces/miscInterfaces";
import {PlaceService} from "../services/PlaceService";

@Route('api/v1/place/')
@Tags('Place')
export class PlaceController extends Controller {

    @Security('Bearer', ['admin'])
    @Get()
    public async getAll(@Query() page: number = 1, @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IPlace>> {
        return await new PlaceService().paginate(page, limit, sortAsc, fieldSort);
    }

    @Security('Bearer', ['admin'])
    @Post('filter')
    public async filter(@Body() body: ISearchAndFilter, @Query() page: number = 1,
                        @Query() limit: number = 10, @Query() sortAsc: boolean = true,
                        @Query() fieldSort: string = '_id'): Promise<IPaginateResult<IPlace>> {
        return await new PlaceService().paginate(page, limit, sortAsc, fieldSort, body);
    }

    @Security('Bearer', ['admin'])
    @Get('{id}')
    public async get(id: string): Promise<IPlace> {
        return await new PlaceService().get(id);
    }

    @Security('Bearer', ['admin'])
    @Post()
    public async create(@Body() body: IPlaceCreateDto): Promise<IPlace> {
        return await new PlaceService().create(body);
    }

    @Security('Bearer', ['admin'])
    @Put('{id}')
    public async update(id: string, @Body() body: IPlaceUpdateDto): Promise<IPlace> {
        return await new PlaceService().update(id, body as IPlace);
    }

    @Security('Bearer', ['admin'])
    @Delete('{id}')
    public async delete(id: string): Promise<IPlace> {
        return await new PlaceService().delete(id);
    }
}