import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router";

import useBoard from "../hooks/useBoard";

import BoardHeader from "./BoardHeader";
import ReplyForm, { Ref as ReplyFormRef } from "./forms/ReplyForm";
import PostBoxBody from "./PostBoxThread";
import useThread from "../hooks/useThread";
import LoadingSpinner from "./LoadingSpinner";
import NotFoundPage from "./NotFoundPage";
import { Thread } from "../types";

export default function ThreadPage() {
    const navigate = useNavigate();
    const replyFormRef = useRef<ReplyFormRef>(null);
    const highlightedRef = useRef<HTMLDivElement | null>(null);
    const [highlightedRefReady, setHighlightedRefReady] = useState(false);

    const { hash } = useLocation();
    const { threadNumber: threadNumberStr } = useParams();
    const threadNumber = Number(threadNumberStr);

    const hashNumber = Number(hash.substring(1));
    const [highlightedMessage, setHighlightedMessage] = useState(
        !Number.isNaN(hashNumber) ? hashNumber : null
    );

    const board = useBoard();
    const {
        thread,
        reply: replyTigger,
        deletePost,
        deletePostFile,
        error,
        remove,
    } = useThread(board, threadNumber);

    useEffect(() => {
        if (highlightedMessage === null || !highlightedRefReady) return;

        highlightedRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        const clearHighlightedMessage = setTimeout(() => {
            setHighlightedMessage(null);
        }, 3000);

        // eslint-disable-next-line consistent-return
        return () => clearTimeout(clearHighlightedMessage);
    }, [highlightedMessage, highlightedRefReady]);

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

    const quotePost = (postId: number) => {
        replyFormRef?.current?.quotePost(postId);
    };

    const deleteThread = async (thread1: Thread) => {
        if (window.confirm("Haluatko varmasti poistaa langan?")) {
            await remove(thread1);
            navigate(`/${board.path}`);
        }
    };

    const title = thread.title || `Lanka #${thread.number}`;
    const pageTitle = `/${board.path}/ - ${title}`;

    const opPost = thread.posts.find((p) => p.number === thread.number);
    const replies = thread.posts.filter((p) => p.number !== thread.number);

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <BoardHeader />

            <main>
                <article className="p-2">
                    {!opPost && (
                        <>
                            <h2 className="text-xl">{title}</h2>
                            <span className="text-gray-500 bold">
                                Langan aloitusviesti on poistettu.
                            </span>
                            <br />
                        </>
                    )}

                    {opPost && (
                        <div
                            className="mb-1 sm:mb-0 p-1 w-full sm:max-w-[96%] border-2 border-purple-200 sm:border-none bg-white sm:bg-transparent"
                            ref={
                                opPost.number === highlightedMessage
                                    ? highlightedRef
                                    : undefined
                            }
                        >
                            <PostBoxBody
                                thread={thread}
                                post={opPost}
                                quotePost={quotePost}
                                deletePost={deletePost}
                                deletePostFile={deletePostFile}
                                setHighlightedMessage={setHighlightedMessage}
                                deleteThread={deleteThread}
                            />
                            <div className="clear-both sm:clear-none" />
                        </div>
                    )}

                    {replies.map((reply) => (
                        <React.Fragment key={reply.id}>
                            <div
                                className={`mb-1 sm:mb-0 overflow-hidden border-2 ${
                                    reply.number === highlightedMessage
                                        ? "border-purple-500"
                                        : "border-purple-200"
                                } bg-white p-1 block sm:inline-block w-full sm:w-auto sm:max-w-[96%] break-words`}
                                key={reply.id}
                                id={`${reply.id}`}
                                ref={(ref) => {
                                    if (reply.number === highlightedMessage) {
                                        highlightedRef.current = ref;
                                        setHighlightedRefReady(true);
                                    }
                                }}
                            >
                                <PostBoxBody
                                    thread={thread}
                                    post={reply}
                                    quotePost={quotePost}
                                    deletePost={deletePost}
                                    deletePostFile={deletePostFile}
                                    setHighlightedMessage={
                                        setHighlightedMessage
                                    }
                                />
                            </div>
                            <br className="hidden sm:block" />
                        </React.Fragment>
                    ))}

                    {!replies ? (
                        <i>Ladataan vastauksia...</i>
                    ) : (
                        <ReplyForm
                            replyThread={replyTigger}
                            ref={replyFormRef}
                        />
                    )}
                </article>
            </main>
        </>
    );
}
