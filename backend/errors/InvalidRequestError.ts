export default class InvalidRequestError extends Error {
    field?: string;

    constructor(field: string | undefined, message: string) {
        super(message);
        this.name = "InvalidRequestError";
        this.field = field;
    }
}
