export default function errorHandler(error, request, response, next) {
    switch (error.name) {
        case "CastError":
            return response.status(400).send({
                error: "Malformatted id",
            });
        case "ValidationError":
            return response.status(400).json({
                error: error.message,
            });
        case "TokenExpiredError":
            return response.status(400).json({
                error: "Session expired",
            });
        default:
            console.log(error);
    }

    next(error);
}
