import zod from "zod";

const userSchema = zod.object({
    username: zod.string().min(1).max(50),
    password: zod.string().min(1).max(50),
    email: zod.string().email(),
});

export default userSchema;
