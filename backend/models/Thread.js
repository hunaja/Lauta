import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
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
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Thread", threadSchema);
