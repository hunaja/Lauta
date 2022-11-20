import { StoreSlice } from "../hooks/useStore";
import threadsService from "../services/threadsService";
import {
    Board,
    PostForm,
    Thread,
    Post,
    ThreadForm,
    ThreadsSlice,
    AuthSlice,
} from "../types";

const createThreadsSlice: StoreSlice<ThreadsSlice, AuthSlice> = (set, get) => ({
    threads: [],
    loadedBoards: [],
    loadPreviews: async (board: Board, page = 0) => {
        const threads = await threadsService.getPreviews(board, page);

        if (!get().loadedBoards.includes(board.id)) {
            set((state) => ({ loadedBoards: [...state.loadedBoards, board.id] }));
        }

        set((state) => ({
            threads: [...state.threads.filter((t) => t.board !== board.id), ...threads],
        }));
    },
    refreshPreviews: async (board: Board) => {
        set(({ loadedBoards }) => ({ loadedBoards: loadedBoards.filter((id) => id !== board.id) }));
    },
    createThread: async (board: Board, threadForm: ThreadForm): Promise<Thread> => {
        const thread = await threadsService.create(board, threadForm);

        set((state) => ({ threads: [thread, ...state.threads] }));
        return thread;
    },
    fetchThreadByNumber: async (board: Board, number: number) => {
        const thread = await threadsService.getThreadByNumber(number);

        set((state) => ({ threads: [...state.threads.filter((t) => t.id !== thread.id), thread] }));
        return thread;
    },
    replyThread: async (thread: Thread, postForm: PostForm) => {
        const replyPost = await threadsService.reply(thread, postForm);

        const { posts: oldPosts, ...otherProps } = thread;
        const repliedThread = { ...otherProps, posts: [...oldPosts, replyPost] };

        set((state) => ({
            threads: [...state.threads.filter((t) => t.id !== thread.id), repliedThread],
        }));
    },
    // Temp solution
    loadThreadWithPost: async (postNumber: number) => {
        const thread = await threadsService.getThreadWithPost(postNumber);
        set((state) => ({ threads: [...state.threads.filter((t) => t.id !== thread.id), thread] }));
    },
    deletePost: async (thread: Thread, post: Post) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        await threadsService.deletePost(token, post);

        // Remove the reply from its thread
        set((state) => ({
            threads: [
                ...state.threads.filter((t) => t.id !== thread.id),
                { ...thread, posts: thread.posts.filter((p) => p.id !== post.id) },
            ],
        }));
    },
    deletePostFile: async (thread: Thread, post: Post) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        await threadsService.deletePostFile(token, post);

        const posts = !post.text.trim()
            ? thread.posts.filter((p) => p.id !== post.id)
            : [...thread.posts.filter((p) => p.id !== post.id), { ...post, file: undefined }];

        set((state) => ({
            threads: [
                ...state.threads.filter((t) => t.id !== thread.id),
                {
                    ...thread,
                    posts,
                },
            ],
        }));
    },
});

export default createThreadsSlice;
