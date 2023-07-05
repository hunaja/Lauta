declare module "mongoose-sequence" {
    function mongooseSequence(
        instance: typeof import("mongoose"),
        options?: object
    ): any;

    export default mongooseSequence;
}

declare module "mongoose-unique-validator" {
    function anyFunction(): any;

    export default anyFunction;
}
