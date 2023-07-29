import zod from "zod";

const threadSchema = zod.object({
    title: zod.string().max(100),
});

export default threadSchema;
