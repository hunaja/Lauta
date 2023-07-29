import { useCallback } from "react";
import useSWR, { SWRConfiguration } from "swr";

import { Board, Post, PostForm, Thread, ThreadForm } from "../../types";
import threadsService from "../../services/threadsService";
import useAuthStore from "../../use_auth";
import postsService from "../../services/postsService";
import boardsService from "../../services/boardsService";

export default function useThread(
    board?: Board,
    threadNumber?: number,
    preview = false,
    config: SWRConfiguration<Thread, any> = {}
) {
    const token = useAuthStore((state) => state.authorizedUser?.token);

    const {
        data: thread,
        mutate,
        error,
    } = useSWR(
        board && threadNumber
            ? `/api/boards/${board.path}/threads/${threadNumber}?preview=${preview}`
            : null,
        board && threadNumber
            ? async () => threadsService.getThread(threadNumber, preview)
            : null,
        {
            refreshInterval: 10000,
            ...config,
        }
    );

    const create = useCallback(
        async (form: ThreadForm) => {
            if (!board) {
                throw new Error("Board is not defined");
            }

            const createdThread = boardsService.createThread(board, form);
            mutate(createdThread, false);

            return createdThread;
        },
        [board, mutate]
    );

    const remove = useCallback(
        async (thread1: Thread) => {
            if (!board) {
                throw new Error("Board is not defined");
            }

            if (!token) {
                throw new Error("Unauthorized");
            }

            await threadsService.remove(token, thread1);

            mutate(undefined, false);
        },
        [board, mutate, token]
    );

    const reply = useCallback(
        async (form: PostForm) => {
            if (!thread) {
                throw new Error("Thread is not defined");
            }

            if (!board) {
                throw new Error("Board is not defined");
            }

            const replyPost = await threadsService.reply(thread, form);

            const { posts: oldPosts, ...otherProps } = thread;
            const repliedThread = {
                ...otherProps,
                posts: [...oldPosts, replyPost],
            };

            mutate(repliedThread, false);

            return replyPost;
        },
        [board, mutate, thread]
    );

    const deletePost = useCallback(
        async (post: Post) => {
            if (!thread) {
                throw new Error("Thread is not defined");
            }

            if (!board) {
                throw new Error("Board is not defined");
            }

            if (!token) {
                throw new Error("Unauthorized");
            }

            await postsService.deletePost(token, post);

            // Remove the reply from its thread
            const { posts: oldPosts, ...otherProps } = thread;
            const updatedThread = {
                ...otherProps,
                posts: oldPosts.filter((p) => p.id !== post.id),
            };

            mutate(updatedThread, false);
        },
        [board, mutate, thread, token]
    );

    const deletePostFile = useCallback(
        async (post: Post) => {
            if (!thread) {
                throw new Error("Thread is not defined");
            }

            if (!board) {
                throw new Error("Board is not defined");
            }

            if (!token) {
                throw new Error("Unauthorized");
            }

            await postsService.deletePostFile(token, post);

            // Remove the reply file from its thread
            const { posts: oldPosts, ...otherProps } = thread;

            const updatedThread = {
                ...otherProps,
                posts: oldPosts.map((p) =>
                    p.id === post.id ? { ...p, file: undefined } : p
                ),
            };

            mutate(updatedThread, false);
        },
        [board, mutate, thread, token]
    );

    return { thread, create, reply, error, remove, deletePost, deletePostFile };
}
