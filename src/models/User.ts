import {Document, Schema, Model, model} from 'mongoose'
import * as crypto from 'crypto'
import * as mongoosePaginate from 'mongoose-paginate'

export const SALT = '5c07a1d7b7d6d30cc7c59bf865860d75ff6ec8fef9e54c416501e9d0e2172d09';

export interface ISearchAndFilter {
    search: any,
    body: any
}

export interface IUser {
    username: string,
    roles: string[],
    email: string,
    name: string
}

export interface ICreateUserDto {
    username: string,
    email: string,
    name: string,
    password: string
}

export interface IJWTToken {
    id: string,
    roles: string[]
}

interface IUserDocument extends IUser, Document {
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

//  function encryptPassword(password: string): string {
// 	return crypto
// 		.createHmac('sha1', SALT)
// 		.update(password)
// 		.digest('hex');
// 	// more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
// };

// UserSchema.virtual("password").get(() => {
//     return this.password ;
// });

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

UserSchema.pre<IUserDocument>("save", function (next) {
    // this.hashedPassword = encryptPassword(this.password);
    next();
});

// UserSchema.virtual('password')
// 	.set(function (password) {
// 		this._plainPassword = password;
// 		// more secure - this.salt = crypto.randomBytes(128).toString('hex');
// 		this.hashedPassword = this.encryptPassword(password);
// 	})
// 	.get(function () {
// 		return this._plainPassword;
//     });

//     UserSchema.virtual("pass").get(function(this: { firstName: string, lastName: string}) {
//         return this.firstName + " " + this.lastName ;
//       }) ;


//       export interface IUser extends Document {
//         usernname: string,
//         password: string
//       }

//       const usersSchema = new Schema({
//         username: String,
//         password: String,
//       });

//       UserSchema.pre<IUserDocument>("save", function(next) {
//         this.password
//         next();
//       });


// export var UserInterface: UserInterface;


export const User = model<IUserDocument>('User', UserSchema);
// export const User: Model<UserInterfaceDocument> = model<UserInterfaceDocument>('User', UserSchema);
// const User = model('User', UserSchema);
// export {User}
// export var User = model('User', UserSchema);
