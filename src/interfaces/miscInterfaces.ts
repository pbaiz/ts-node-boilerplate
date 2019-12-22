export interface IErrorResponseModel {
    status: number;
    message: string;
}

export interface IPaginateResult<T> {
    docs: Array<T>;
    total: number;
    limit: number;
    page?: number;
    pages?: number;
    offset?: number;
}