import {IUser} from "../repositories/UserRepository";

export interface ILogin {
    username: string,
    password: string
}

export interface IAuthenticationResponse {
    token: string,
    user: IUser
}

export interface ISearchAndFilter {
    query?: any,
    filter?: any
}

export interface IPaginateResult<T> {
    docs: Array<T>;
    total: number;
    limit: number;
    page?: number;
    pages?: number;
    offset?: number;
}