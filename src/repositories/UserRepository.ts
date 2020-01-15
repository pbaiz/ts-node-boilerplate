import {Document, model, Schema} from 'mongoose'
import * as crypto from 'crypto'
import * as mongoosePaginate from 'mongoose-paginate'

const SALT = '1d8b84e4a115eea3f32ea772070238ab832bcd72b2fb59566c6e13e21c5d99db';

interface IUserAbstraction {
    username: string,
    roles: string[],
    email: string,
    name: string,
    active: boolean
}

export interface IUser extends IUserAbstraction{
    _id: string
}

export interface IUserCreateDto {
    username: string,
    email: string,
    name: string,
    password: string
}

export interface IUserUpdateDto {
    username: string,
    roles: string[],
    email: string,
    name: string,
    active: boolean
}

export interface IJWTToken {
    id: string,
    roles: string[]
}

interface IUserDocument extends IUserAbstraction, Document {
    password: string,
    hashedPassword: string,

    checkPassword(password: string): boolean
}

const UserSchema = new Schema({
    hashedPassword: String,
    username: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true
    },
    name: String,
    roles: [{
        type: String, enum: ['admin'], trim: true
    }],
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret, options) => {
            delete ret.hashedPassword;
            return ret;
        },
        virtuals: false,
    }
});

UserSchema.plugin(mongoosePaginate);

UserSchema.methods.encryptPassword = function (password) {
    return crypto
        .createHmac('sha1', SALT)
        .update(password)
        .digest('hex');
    // more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

UserSchema.virtual('password')
    .set(function (password: string) {
        this._plainPassword = password;
        // more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function (): string {
        return this._plainPassword;
    });

UserSchema.methods.checkPassword = function (password: string): boolean {
    return this.encryptPassword(password) === this.hashedPassword;
};

export const UserRepository = model<IUserDocument>('User', UserSchema);
