import useSWR from "swr";

import { Board, Post, PostForm, ThreadForm } from "../types";
import threadsService from "../services/threadsService";
import useStore from "./useStore";

export default function useThread(board?: Board, threadNumber?: number) {
    const token = useStore((state) => state.authorizedUser?.token);

    const { data: thread, mutate } = useSWR(
        board && threadNumber
            ? `/api/boards/${board.path}/threads/${threadNumber}`
            : null,
        board && threadNumber
            ? async () => threadsService.getThreadByNumber(threadNumber)
            : null,
        {
            refreshInterval: 10000,
        }
    );

    const create = async (form: ThreadForm) => {
        if (!board) {
            throw new Error("Board is not defined");
        }

        const createdThread = threadsService.create(board, form);
        mutate(createdThread, false);

        return createdThread;
    };

    const reply = async (form: PostForm) => {
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
    };

    const deletePost = async (post: Post) => {
        if (!thread) {
            throw new Error("Thread is not defined");
        }

        if (!board) {
            throw new Error("Board is not defined");
        }

        if (!token) {
            throw new Error("Unauthorized");
        }

        await threadsService.deletePost(token, post);

        // Remove the reply from its thread
        const { posts: oldPosts, ...otherProps } = thread;
        const updatedThread = {
            ...otherProps,
            posts: oldPosts.filter((p) => p.id !== post.id),
        };

        mutate(updatedThread, false);
    };

    const deletePostFile = async (post: Post) => {
        if (!thread) {
            throw new Error("Thread is not defined");
        }

        if (!board) {
            throw new Error("Board is not defined");
        }

        if (!token) {
            throw new Error("Unauthorized");
        }

        await threadsService.deletePostFile(token, post);

        // Remove the reply file from its thread
        const { posts: oldPosts, ...otherProps } = thread;

        const updatedThread = {
            ...otherProps,
            posts: oldPosts.map((p) =>
                p.id === post.id ? { ...p, file: undefined } : p
            ),
        };

        mutate(updatedThread, false);
    };

    return { thread, create, reply, deletePost, deletePostFile };
}
