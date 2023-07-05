import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import { UserRole } from "../types.js";

export type User = {
    id: string;
    username: string;
    passwordHash: string;
    role: UserRole;
};

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
        enum: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.TRAINEE],
        required: true,
    },
});

userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.passwordHash;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<User>("User", userSchema);
