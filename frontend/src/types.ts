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
    board: string; // Board ID
    title: string;
    fileReplyCount: number;
    replyCount: number;
    bumpedAt: number;
    posts: Post[];
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
    /** Date resorvable */
    sentAt: string;
    name: string;
    postNumber: string;
}

export interface ImageboardSlice {
    imageboardConfig: ImageboardConfig | null;
    latestImages: ImagePreview[] | null;
    initializeImageboard: () => Promise<void>;
    initializeLatestImages: () => Promise<void>;
}

export interface BoardsSlice {
    boards: Board[];
    initializeBoards: () => Promise<void>;
    createBoard: (boardWithoutId: BoardWithoutId) => Promise<void>;
    updateBoard: (board: Board) => Promise<void>;
    deleteBoard: (board: Board) => Promise<void>;
}

export interface ThreadsSlice {
    threads: Thread[];
    /** Ids of the boards that have been loaded. */
    loadedBoards: string[];
    loadPreviews: (board: Board, pageNumber?: number) => Promise<void>;
    refreshPreviews: (board: Board) => void;
    createThread: (board: Board, threadForm: ThreadForm) => Promise<Thread>;
    fetchThreadByNumber: (board: Board, threadNumber: number) => Promise<Thread>;
    replyThread: (thread: Thread, postForm: PostForm) => Promise<void>;
    loadThreadWithPost: (postNumber: number) => Promise<void>;
    deletePost: (thread: Thread, post: Post) => Promise<void>;
    deletePostFile: (thread: Thread, post: Post) => Promise<void>;
}

export interface AuthSlice {
    authorizedUser: AuthorizedUser | null;
    initializeAuth: () => void;
    login: (loginForm: LoginForm) => Promise<void>;
    logout: () => void;
}

export interface UsersSlice {
    users: Array<User>;
    initializeUsers: () => Promise<void>;
    createUser: (userForm: UserForm) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    editUser: (userId: string, userForm: UserForm) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export type Store = ImageboardSlice & BoardsSlice & ThreadsSlice & AuthSlice & UsersSlice;
