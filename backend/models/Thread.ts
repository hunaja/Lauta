import mongoose, { PopulatedDoc, Document } from "mongoose";
import { Post } from "./Post.js";
import { Board } from "./Board.js";

export interface Thread extends Document {
    id: string;
    number: number;
    board: PopulatedDoc<Board, mongoose.Types.ObjectId>;
    title: string;
    locked: boolean;
    bumpedAt: number;
    replyCount: number;
    fileReplyCount: number;
    // Post ids are either populated or ObjectId
    posts: Array<PopulatedDoc<Post, mongoose.Types.ObjectId>>;
}

const threadSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
    },
    title: String,
    locked: { type: Boolean, default: false },
    bumpedAt: { type: Date, default: 0 },
    replyCount: {
        type: Number,
        default: 0,
    },
    fileReplyCount: {
        type: Number,
        default: 0,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

threadSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model<Thread>("Thread", threadSchema);
