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

export function filterByKeys(obj, keys = []) {
    const filtered = {};
    if (!keys) return obj;
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            filtered[key] = obj[key]
        }
    });

    return filtered;
}

const myObject = {
    a: 1,
    b: 'bananas',
    d: null
};

// const result = filterByKeys(myObject, ['a', 'd', 'e']) // {a: 1, d: null}
// console.log(result)


class Box {
    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor();
    constructor(obj);
    constructor(obj?) {
        this.x = !obj ? 0 : obj.x;
        this.y = !obj ? 0 : obj.y;
        this.height = !obj ? 0 : obj.height;
        this.width = !obj ? 0 : obj.width;
    }
}