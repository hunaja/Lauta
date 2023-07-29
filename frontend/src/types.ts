// eslint-disable-next-line no-shadow
export enum UserRole {
    ADMIN = "SOPSY",
    MODERATOR = "MODERATOR",
    TRAINEE = "JANNY",
}

export interface Board {
    id: string;
    path: string;
    name: string;
    title: string;
}

export type BoardWithoutId = Omit<Board, "id">;

export interface PostFile {
    name: string;
    size: number;
}

export interface Post {
    id: number;
    text: string;
    author?: string;
    file?: PostFile;
    createdAt: string;
    editedAt: string | null;
    saging: boolean;
}

export interface Thread {
    id: number;
    board: string;
    title: string;
    fileReplyCount: number;
    replyCount: number;
    bumpedAt: string;
    posts: Post[];
}

export interface CatalogThread extends Omit<Thread, "posts"> {
    posts: [Post] | [];
}

export interface PostPreview extends Post {
    thread: Omit<Thread, "posts">;
}

export interface User {
    id: string;
    username: string;
    role: UserRole;
}

export type UserWithoutId = Omit<User, "id">;

export interface AuthorizedUser extends User {
    token: string;
}

export interface PostForm {
    text: string;
    email: string;
    file?: File;
    author: string;
}

export interface ThreadForm {
    title: string;
    post: PostForm;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface UserForm {
    username: string;
    role: UserRole;
}

export interface ImageboardConfig {
    thumbnailPath: string;
    opThumbnailPath: string;
}

export interface ImagePreview {
    id: string;
    sentAt: string;
    name: string;
    postNumber: string;
}

export interface AuthStore {
    authorizedUser: AuthorizedUser | null;
    initializeAuth: () => void;
    login: (loginForm: LoginForm) => Promise<void>;
    logout: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export interface TimeStore {
    time: Date;
    setTime: (time: Date) => void;
}
