import { Controller, Route, Request, Response, Get, Post, Put, Delete, Security, Body} from 'tsoa'
import * as express from 'express';
import * as jwt from 'jsonwebtoken'
import { User } from '../models/User';

interface ILogin{
    username: string,
    password: string
};

interface IAuthenticationResponse{
    token: string
};

@Route('api/v1/authentication/')
export class UserController extends Controller{

    @Post('signin')
    public async signin(@Body() body: ILogin, @Request() request: express.Request): Promise<IAuthenticationResponse> {
        let user = await User.findOne({username: body.username});
        let validPassword = user.checkPassword(body.password);
        return 
    }
    
    @Post('login')
    public async login(@Body() body: ILogin, @Request() request: express.Request): Promise<IAuthenticationResponse> {
        let user = await User.findOne({username: body.username});
        let validPassword = user.checkPassword(body.password);
        return 
    }
    

}