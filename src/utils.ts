export class ServerError {
    public readonly status?: number = 500;
    public readonly internalServerErrors?: InternalServerError[];

    constructor(
        status: number = 500,
        internalServerErrors?: InternalServerError[],
    ) {
        this.status = status;
        this.internalServerErrors = internalServerErrors;
    }
}

export class InternalServerError {
    public readonly code?: number = 1000;
    public readonly name?: string = 'UnknownError';
    public readonly message: string;
    public readonly stackTrace: any;

    constructor(message: string, stackTrace: any) {
        this.message = message;
        this.stackTrace = stackTrace;
    }
}
