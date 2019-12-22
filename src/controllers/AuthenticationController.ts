import {Controller, Route, Request, Response, Get, Post, Put, Delete, Security, Body} from 'tsoa'
import * as express from 'express';
import * as jwt from 'jsonwebtoken'
import * as log4js from 'log4js'
import {User, IUser, ICreateUserDto, SALT, IJWTToken} from '../models/User';
import {ServerError} from "../utils";

const logger = log4js.getLogger("AuthenticationController");

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

    @Post('signup')
    public async signup(@Body() body: ICreateUserDto, @Request() request: express.Request)
        : Promise<IAuthenticationResponse> {
        try {
            let user = await User.findOne({username: body.username});
            if (user) throw new ServerError(409);

            user = await User.create(body);
            const jwtToken: IJWTToken = {
                id: user.id,
                roles: user.roles
            };
            let token = await jwt.sign(jwtToken, SALT);

            return {token, user};
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post('login')
    public async login(@Body() body: ILogin, @Request() request: express.Request): Promise<IAuthenticationResponse> {
        try {
            let user = await User.findOne({username: body.username});
            if (!user) {
                request.res.status(401).send().end();
                logger.info(`login - bad login: ${body.username}`);
                return null;
            }
            let validPassword = user.checkPassword(body.password);
            if(!validPassword) request.res.status(401).send().end();
            const jwtToken: IJWTToken = {
                id: user.id,
                roles: user.roles
            };
            let token = await jwt.sign(jwtToken, SALT);

            return {token, user};
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any){
        console.error(error);
        logger.error(error);
        if (!error) {
            throw new ServerError(error.message, error.stack);
        }
    }
}