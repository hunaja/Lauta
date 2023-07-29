import React, { useState } from "react";
import useThread from "./thread/use_thread";
import { Board, Thread as ThreadType } from "../types";
import Thread from "./thread/thread";

export default function ThreadListThread({
    board,
    thread: initialThread,
}: {
    board: Board;
    thread: ThreadType;
}) {
    const [opened, setOpened] = useState(true);

    const {
        thread,
        reply: replyTigger,
        deletePost,
        deletePostFile,
        // error,
        // remove,
    } = useThread(board, initialThread.id, opened, {
        fallbackData: initialThread,
        revalidateOnMount: false,
    });

    if (!board) return null;

    const openPreview = () => {
        setOpened(false);
    };

    // TODO: Tähän jotain
    const deleteThread = async (thread1: ThreadType) => {
        window.alert("Unsupported");
        // if (window.confirm("Haluatko varmasti poistaa langan?")) {
        //    await remove(thread1);
        // }
    };

    if (!thread) return null; // Should not happen tho

    return (
        <Thread
            thread={thread}
            deletePost={deletePost}
            deletePostFile={deletePostFile}
            deleteThread={deleteThread}
            reply={replyTigger}
            openPreview={openPreview}
            preview
        />
    );
}
