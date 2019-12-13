// export enum ErrorType {
//     Unknown = 1,
// }

// export class ServerError extends Error {
//     constructor(
//         message: string,
//         public readonly status = 500,
//         public readonly type: ErrorType = ErrorType.Unknown
//     ) {
//         super(message);
//     }
// }

export class ServerError {
    constructor(
        public readonly status = 500,
        public readonly internalServerErrors: InternalServerError[],
    ) {
        this.status = status;
        this.internalServerErrors = internalServerErrors;
    }
}

export class InternalServerError {
    constructor(
        public readonly code: number,
        public readonly name: string,
        public readonly message: string,
        public readonly stackTrace: any
    ) {
        this.code = code;
        this.name = name;
        this.message = message;
        this.stackTrace = stackTrace;
    }
}