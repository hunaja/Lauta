import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 3,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["SOPSY", "MODERATOR", "JANNY"],
        required: true,
    },
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.passwordHash;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
