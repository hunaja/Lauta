import zod from "zod";

const changePasswordSchema = zod.object({
    oldPassword: zod.string().min(1).max(50),
    newPassword: zod.string().min(1).max(50),
});

export default changePasswordSchema;
