import mongoose, { type Document } from "mongoose";

export interface PostFileInterface extends Document {
    name: string;
    mimeType: string;
    location: string;
    size: number;
    spoiler: boolean;
}

const postFileSchema = new mongoose.Schema<PostFileInterface>(
    {
        name: {
            type: String,
            required: true,
            maxLength: 64,
        },
        mimeType: String,
        location: String,
        size: Number,
        spoiler: Boolean,
    },
    { _id: false }
);

postFileSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.mimeType;
        delete returnedObject.location;
    },
});

export default postFileSchema;
