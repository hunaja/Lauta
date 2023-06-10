import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";

import InsufficientPermissionsError from "../errors/InsufficentPermissionsError";
import NotFoundError from "../errors/NotFoundError";
import AuthRequiredError from "../errors/AuthRequiredError";
import InvalidRequestError from "../errors/InvalidRequestError";
import { logError } from "./logger";

const { TokenExpiredError } = jsonwebtoken;

export default function errorHandler(
    error: unknown,
    _request: Request,
    response: Response,
    next: NextFunction
) {
    if (error instanceof mongoose.Error.ValidationError) {
        return response.status(400).json({
            error: error.message,
        });
    } else if (error instanceof mongoose.Error.CastError) {
        return response.status(400).json({
            error: "Malformatted id",
        });
    } else if (error instanceof TokenExpiredError) {
        return response.status(400).json({
            error: "Session expired",
        });
    } else if (error instanceof InvalidRequestError) {
        return response.status(400).json({
            error: error.message,
        });
    } else if (error instanceof InsufficientPermissionsError) {
        return response.status(403).json({
            error: error.message,
        });
    } else if (error instanceof NotFoundError) {
        return response.status(404).json({
            error: error.message,
        });
    } else if (error instanceof AuthRequiredError) {
        return response.status(401).json({
            error: error.message,
        });
    } else {
        logError(error);

        return response.status(500).json({
            error: "Internal server error",
        });
    }

    next(error);
}
