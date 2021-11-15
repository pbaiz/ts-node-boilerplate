import {Document, model, Schema} from 'mongoose'
import * as crypto from 'crypto'
import * as mongoosePaginate from 'mongoose-paginate'

interface IPlaceAbstraction {
    location: string,
    name: string,
    active: boolean
}

export interface IPlace extends IPlaceAbstraction {
    _id: string
}

export interface IPlaceCreateDto {
    location: string,
    name: string,
    specialField: string
}

export interface IPlaceUpdateDto {
    location: string,
    name: string,
    active: boolean
}

interface IPlaceDocument extends IPlaceAbstraction, Document {
    specialField: string
}

const PlaceSchema = new Schema({
    location: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true
    },
    name: String,
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

PlaceSchema.plugin(mongoosePaginate);


export const PlaceRepository = model<IPlaceDocument>('Place', PlaceSchema);
