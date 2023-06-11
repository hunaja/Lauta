export type RoleStr = "SOPSY" | "MODERATOR" | "JANNY";

export interface Role {
    name: RoleStr;
    weight: number;
    pretty: string;
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
    id: string;
    number: number;
    text: string;
    author?: string;
    file?: PostFile;
    createdAt: string;
    editedAt: string | null;
    saging: boolean;
}

export interface Thread {
    id: string;
    number: number;
    board: string;
    title: string;
    fileReplyCount: number;
    replyCount: number;
    bumpedAt: number;
    posts: Post[];
}

export interface PostPreview extends Post {
    thread: Omit<Thread, "posts">;
}

export interface User {
    id: string;
    username: string;
    role: RoleStr;
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
    role: RoleStr;
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

export interface ImageboardSlice {
    imageboardConfig: ImageboardConfig | null;
    initializeImageboard: () => Promise<void>;
}

export interface AuthSlice {
    authorizedUser: AuthorizedUser | null;
    initializeAuth: () => void;
    login: (loginForm: LoginForm) => Promise<void>;
    logout: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export type Store = ImageboardSlice & AuthSlice;
