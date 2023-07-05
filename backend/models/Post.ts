import mongoose, { PopulatedDoc } from "mongoose";
import autoIncrementFactory from "mongoose-sequence";

import PostFile, { PostFileInterface } from "./PostFile.js";
import { Thread } from "./Thread.js";

const AutoIncrement = autoIncrementFactory(mongoose);

// Post ts interface
export interface Post extends Document {
    _id: string;
    number: number;
    text: string;
    author?: string;
    file?: PostFileInterface;
    thread: PopulatedDoc<Thread, mongoose.Types.ObjectId>;
    createdAt: string;
    editedAt: string | null;
    saging: boolean;
}

const postSchema = new mongoose.Schema({
    number: {
        type: Number,
        unique: true,
    },
    author: {
        type: String,
        maxLength: 20,
        required: false,
    },
    saging: Boolean,
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
    },
    createdAt: { type: Date, required: true },
    editedAt: Date,
    text: {
        type: String,
        maxLength: 10000,
    },
    passwordHash: String,
    file: PostFile,
});

postSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.thread;
        delete returnedObject.passwordHash;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

postSchema.plugin(AutoIncrement, { inc_field: "number" });

export default mongoose.model<Post>("Post", postSchema);
