import mongoose from "mongoose";

const postFileSchema = new mongoose.Schema(
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
