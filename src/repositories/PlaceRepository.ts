import {Document, model, Schema} from 'mongoose'
import * as crypto from 'crypto'
import * as mongoosePaginate from 'mongoose-paginate'

const SALT = '1d8b84e4a115eea3f32ea772070238ab832bcd72b2fb59566c6e13e21c5d99db';

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
    password: string
}

export interface IPlaceUpdateDto {
    location: string,
    name: string,
    active: boolean
}

interface IPlaceDocument extends IPlaceAbstraction, Document {
    password: string
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
