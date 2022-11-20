import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const boardSchema = new mongoose.Schema({
    number: Number,
    name: {
        type: String,
        maxLength: 64,
        required: true,
    },
    path: {
        type: String,
        maxLength: 32,
        required: true,
        unique: true,
    },
    title: String,
});

boardSchema.plugin(uniqueValidator);

boardSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Board", boardSchema);
