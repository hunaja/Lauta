import multer, { MulterError } from "multer";
import { fileTypeFromBuffer } from "file-type";

import config from "./config.js";
import { Request, Response, NextFunction } from "express";

const upload = multer({
    limits: {
        files: 1,
        fileSize: 5120000,
    },
}).single("file");

const handleMulterError = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Set by the preceding middleware
    if (error instanceof MulterError) {
        const errorMsg =
            error.code === "LIMIT_FILE_SIZE"
                ? "Tiedosto on liian suuri."
                : "Tapahtui tuntematon virhe tiedoston käsittelemisessä.";

        return res.status(400).json({ error: errorMsg, field: "file" });
    }

    next();
};

const validateExtension = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { file } = req;

    if (file) {
        const fileData = await fileTypeFromBuffer(file.buffer);
        const unallowedExtension =
            !fileData?.mime || !config.allowedMimeTypes.includes(fileData.mime);

        if (unallowedExtension)
            return res.status(400).json({
                error: "Antamaasi tiedostomuotoa ei tueta.",
                field: "file",
            });

        req.uploadedFile = {
            ...file,
            actualMimetype: fileData.mime,
            actualExt: fileData.ext,
        };
    }

    next();
};

export default [upload, handleMulterError, validateExtension];
