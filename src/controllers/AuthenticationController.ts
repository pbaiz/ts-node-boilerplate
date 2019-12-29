import {Body, Controller, Post, Route} from 'tsoa'
import {ICreateUserDto} from '../models/User';
import {IAuthenticationResponse, ILogin} from "../interfaces/miscInterfaces";
import {AuthenticationService} from "../services/AuthenticationService";

@Route('api/v1/authentication/')
export class AuthenticationController extends Controller {

    @Post('signup')
    public async signup(@Body() body: ICreateUserDto): Promise<IAuthenticationResponse> {
        return await new AuthenticationService().signup(body);
    }

    @Post('login')
    public async login(@Body() body: ILogin): Promise<IAuthenticationResponse> {
        return await new AuthenticationService().login(body);
    }
}