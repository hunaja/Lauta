import React from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router";

import useBoard from "../use_board";

import BoardHeader from "../../header";
import useThread from "./use_thread";
import LoadingSpinner from "../../spinner";
import NotFoundPage from "../../front/not_found";
import Thread from "./thread";
import { Thread as ThreadType } from "../../types";

export default function ThreadPage() {
    const navigate = useNavigate();

    const { hash } = useLocation();
    const { threadNumber: threadNumberStr } = useParams();
    const threadNumber = Number(threadNumberStr);

    const hashNumber = Number(hash.substring(1)) || undefined;

    const board = useBoard();
    const {
        thread,
        reply: replyTigger,
        deletePost,
        deletePostFile,
        error,
        remove,
    } = useThread(board, threadNumber);

    console.log("Board: ", board);
    console.log("Thread: ", thread);

    if (!board || !threadNumber) return null;

    if (error) {
        return <NotFoundPage />;
    }

    if (!thread) {
        return (
            <div className="h-screen w-screen flex-col flex">
                {board && <BoardHeader />}
                <LoadingSpinner />
            </div>
        );
    }

    const deleteThread = async (thread1: ThreadType) => {
        if (window.confirm("Haluatko varmasti poistaa langan?")) {
            await remove(thread1);
            navigate(`/${board.path}`);
        }
    };

    const title = thread.title || `Lanka #${thread.number}`;
    const pageTitle = `/${board.path}/ - ${title}`;

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <BoardHeader />

            <main>
                <Thread
                    thread={thread}
                    deletePost={deletePost}
                    deletePostFile={deletePostFile}
                    deleteThread={deleteThread}
                    reply={replyTigger}
                    highlighted={hashNumber}
                />
            </main>
        </>
    );
}
