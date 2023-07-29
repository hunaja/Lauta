import zod from "zod";

const threadsQuery = zod.object({
    mode: zod.enum(["default", "catalog"]).default("default"),
    page: zod.string().pipe(zod.coerce.number().min(1).default(1)),
});

export default threadsQuery;
