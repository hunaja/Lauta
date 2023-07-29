import { User } from "@prisma/client";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        export interface Request {
            token?: string;
            session?: Session;
            uploadedFile?: UploadedFile;
        }
    }
}

export type UploadedFile = {
    actualMimetype: string;
    actualExt: string;
} & Express.Multer.File;

export type Session = {
    id: User["id"];
    role: User["role"];
};
