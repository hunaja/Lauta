import mongoose from "mongoose";

export type PostFile = {
    name: string;
    mimeType: string;
    location: string;
    size: number;
    spoiler: boolean;
};

const postFileSchema = new mongoose.Schema<PostFile>(
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
    transform: (document, returnedObject) => {
        delete returnedObject.mimeType;
        delete returnedObject.location;
    },
});

export default postFileSchema;
