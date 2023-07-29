import zod from "zod";

const boardSchema = zod.object({
    name: zod.string().min(1).max(50),
    title: zod.string().min(1).max(100),
    path: zod.string().min(1).max(50),
});

export default boardSchema;
