// Extend the base Error class to create a custom error class
export default class AuthRequiredError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthRequiredError";
    }
}
