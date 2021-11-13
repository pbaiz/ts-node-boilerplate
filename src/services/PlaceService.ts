import {IPlace, IPlaceCreateDto, PlaceRepository} from "../repositories/PlaceRepository";
import {Types} from "mongoose";
import {IPaginateResult, ISearchAndFilter} from "../interfaces/miscInterfaces";
import {InternalServerError, ServerError} from "../utils";
import * as log4js from "log4js";

export class PlaceService {
    private logger = log4js.getLogger("PlaceService");

    public async get(id: string): Promise<IPlace> {
        try {
            const objectId = Types.ObjectId(id);
            let place = await PlaceRepository.findById(objectId);
            if (!place) this.handleError(null);
            return place;
        } catch (error) {
            this.handleError(error);
        }
    }

    public async create(body: IPlaceCreateDto): Promise<IPlace> {
        try {
            return await PlaceRepository.create(body);
        } catch (error) {
            console.error(error);
            if (error) {
                this.handleError(error);
            }
        }
    }

    public async update(id: string, body: IPlace): Promise<IPlace> {
        try {
            return await PlaceRepository.findByIdAndUpdate(id, body, {new: true});
        } catch (error) {
            this.handleError(error);
        }
    }

    public async delete(id: string): Promise<IPlace> {
        try {
            return await PlaceRepository.findByIdAndRemove(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    public async paginate(page: number = 1, limit: number = 10, sortAsc: boolean = true, fieldSort: string = '_id',
                          searchAndFilter: ISearchAndFilter = {
                              query: {},
                              filter: {}
                          }): Promise<IPaginateResult<IPlace>> {
        const sort = {};
        sort[fieldSort] = sortAsc ? 1 : -1;
        try {
            return await PlaceRepository.paginate(searchAndFilter.query, {
                page: page,
                limit: limit,
                sort: sort,
                select: searchAndFilter.filter
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    public handleError(error: any) {
        console.error(error);
        this.logger.error(error);
        if (error instanceof ServerError) throw error;
        const invalidId = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
        if (!error || error.message == invalidId) {
            throw new ServerError(404);
        } else if (error.name === 'MongoError' && error.code === 11000) {
            throw new ServerError(409);
        } else {
            throw new ServerError(500, [new InternalServerError(error.message, error.stack)]);
        }
    }
}