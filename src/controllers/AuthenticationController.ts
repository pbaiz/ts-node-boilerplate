import {Controller, Route, Request, Response, Get, Post, Put, Delete, Security, Body} from 'tsoa'
import * as express from 'express';
import * as jwt from 'jsonwebtoken'
import {User, IUser, ICreateUserDto, SALT} from '../models/User';

interface ILogin {
    username: string,
    password: string
}

interface IAuthenticationResponse {
    token: string,
    user: IUser
}

@Route('api/v1/authentication/')
export class AuthenticationController extends Controller {

    @Post('signin')
    public async signin(@Body() body: ICreateUserDto, @Request() request: express.Request): Promise<IAuthenticationResponse> {
        let user = await User.findOne({username: body.username});
        if (user) {
            request.res.status(401).send().end();
            return null;
        }

        user = await User.create(body);
        let token = await jwt.sign(user.id, SALT);

        return {token, user};
    }

    @Post('login')
    public async login(@Body() body: ILogin, @Request() request: express.Request): Promise<IAuthenticationResponse> {
        let user = await User.findOne({username: body.username});
        if (!user) {
            request.res.status(401).send().end();
            return null;
        }
        let validPassword = user.checkPassword(body.password);
        if(!validPassword) request.res.status(401).send().end();
        let token = await jwt.sign(user.id, SALT);

        return {token, user};
    }


}