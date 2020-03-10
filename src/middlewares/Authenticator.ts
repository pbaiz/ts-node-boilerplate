import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {IJWTToken} from '../repositories/UserRepository';

export const SALT = '26a44e43b71f408b4341a90482099cfae28736b703b486fd50921d34694b30d2';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    if (securityName === 'Bearer') {
        let token = request.headers.authorization;

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            }
            token = token.replace("Bearer ", "");
            jwt.verify(token, SALT, function (err: any, decoded: IJWTToken) {
                if (err) {
                    reject(err);
                } else {
                    // Check if JWT contains all required scopes
                    for (let scope of scopes) {
                        if (!decoded.roles.includes(scope)) {
                            reject(new Error("JWT does not contain required scope."));
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    }
}