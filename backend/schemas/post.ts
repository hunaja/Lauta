import zod from "zod";

const postSchema = zod.object({
    text: zod
        .string()
        .min(1)
        .max(10000)
        .refine((v) => Boolean(v.trim().length)),
    author: zod
        .string()
        .max(50)
        .optional()
        .transform((v) => v?.trim() || undefined),
    email: zod.string().optional(),
});

export default postSchema;
