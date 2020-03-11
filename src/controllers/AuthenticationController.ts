import {Body, Controller, Post, Route, Tags} from 'tsoa'
import {IUserCreateDto} from '../repositories/UserRepository';
import {IAuthenticationResponse, ILogin} from "../interfaces/miscInterfaces";
import {AuthenticationService} from "../services/AuthenticationService";

@Route('api/v1/authentication/')
@Tags('Authentication')
export class AuthenticationController extends Controller {

    @Post('signup')
    public async signup(@Body() body: IUserCreateDto): Promise<IAuthenticationResponse> {
        return await new AuthenticationService().signup(body);
    }

    @Post('login')
    public async login(@Body() body: ILogin): Promise<IAuthenticationResponse> {
        return await new AuthenticationService().login(body);
    }
}