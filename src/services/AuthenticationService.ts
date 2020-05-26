import * as jwt from 'jsonwebtoken'
import * as log4js from 'log4js'
import {IJWTToken, IUserCreateDto, UserRepository} from '../repositories/UserRepository';
import {InternalServerError, ServerError} from "../utils";
import {IAuthenticationResponse, ILogin} from "../interfaces/miscInterfaces";
import {SALT} from "../middlewares/Authenticator";

export class AuthenticationService {
    private logger = log4js.getLogger("AuthenticationService");

    public async signup(body: IUserCreateDto)
        : Promise<IAuthenticationResponse> {
        try {
            let user = await UserRepository.findOne({username: body.username});
            if (user) throw new ServerError(409);

            user = await UserRepository.create(body);
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

    public async login(body: ILogin): Promise<IAuthenticationResponse> {
        try {
            let user = await UserRepository.findOne({username: body.username});
            if (!user) {
                this.logger.info(`login - bad login: ${body.username}`);
                throw new ServerError(401);
            }
            let validPassword = user.checkPassword(body.password);
            if (!validPassword) throw new ServerError(401);
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

    private handleError(error: any) {
        console.error(error);
        this.logger.error(error);
        if (error instanceof ServerError) throw error;
        throw new ServerError(500, [new InternalServerError(error.message, error.stack)]);
    }
}