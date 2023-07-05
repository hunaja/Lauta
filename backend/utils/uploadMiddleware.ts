import multer, { MulterError } from "multer";
import { fileTypeFromBuffer } from "file-type";

import config from "./config.js";
import { Request, Response, NextFunction } from "express";
import InvalidRequestError from "../errors/InvalidRequestError.js";

const upload = multer({
    limits: {
        files: 1,
        fileSize: config.maxFileSize,
    },
}).single("file");

const handleMulterError = (
    error: unknown,
    _req: Request,
    _res: Response,
    next: NextFunction
) => {
    // Set by the preceding middleware
    if (error instanceof MulterError) {
        const errorMsg =
            error.code === "LIMIT_FILE_SIZE"
                ? "Tiedosto on liian suuri."
                : "Tapahtui tuntematon virhe tiedoston käsittelemisessä.";

        throw new InvalidRequestError(errorMsg, "file");
    }

    next();
};

const validateExtension = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const { file } = req;

    if (file) {
        const fileData = await fileTypeFromBuffer(file.buffer);
        const unallowedExtension =
            !fileData?.mime || !config.allowedMimeTypes.includes(fileData.mime);

        if (unallowedExtension)
            throw new InvalidRequestError(
                "Antamaasi tiedostomuotoa ei tueta.",
                "file"
            );

        req.uploadedFile = {
            ...file,
            actualMimetype: fileData.mime,
            actualExt: fileData.ext,
        };
    }

    next();
};

export default [upload, handleMulterError, validateExtension];
