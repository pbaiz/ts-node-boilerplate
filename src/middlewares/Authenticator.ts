import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {User, IUser, SALT} from '../models/User';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    if (securityName === 'api_token') {
        let token;
        if (request.query && request.query.access_token) {
            token = request.query.access_token;
        }

        if (token === 'abc123456') {
            return Promise.resolve({
                id: 1,
                name: 'Ironman'
            });
        } else {
            return Promise.reject({});
        }
    }

    if (securityName === 'jwt') {
        let token = request.headers.authorization;

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"))
            }
            token = token.replace("Bearer ", "");
            jwt.verify(token, SALT, function (err: any, decoded: any) {
                if (err) {
                    reject(err)
                } else {
                    // Check if JWT contains all required scopes
                    for (let scope of scopes) {
                        if (!decoded.scopes.includes(scope)) {
                            reject(new Error("JWT does not contain required scope."));
                        }
                    }
                    resolve(decoded)
                }
            });
        });
    }
};