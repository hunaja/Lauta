import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router";
import useBoard from "../hooks/useBoard";
import useStore from "../hooks/useStore";

import BoardHeader from "./BoardHeader";
import NotFoundPage from "./NotFoundPage";
import ReplyForm, { ReplyFormRef } from "./forms/ReplyForm";
import PostBoxBody from "./PostBoxBody";

export default function ThreadPage() {
    const { hash } = useLocation();
    const hashNumber = Number(hash.substring(1));
    const [highlightedMessage, setHighlightedMessage] = useState(!Number.isNaN(hashNumber)
        ? hashNumber : null);
    const replyFormRef = useRef<ReplyFormRef>(null);
    const [loading, setLoading] = useState(true);
    const board = useBoard();
    const { threadNumber } = useParams();
    const fetchThreadByNumber = useStore((state) => state.fetchThreadByNumber);
    const thread = useStore((state) => state
        .threads.find((t) => t.number === Number(threadNumber)));
    const unloadPreviews = useStore((state) => state.refreshPreviews);
    const boardNotLoaded = useStore((state) => board && !state.loadedBoards.includes(board.id));

    useEffect(() => {
        if (highlightedMessage === null) return;

        const clearHighlightedMessage = setTimeout(() => {
            setHighlightedMessage(null);
        }, 2000);

        console.log(clearHighlightedMessage);

        // eslint-disable-next-line consistent-return
        return () => clearTimeout(clearHighlightedMessage);
    }, [highlightedMessage]);

    useEffect(() => {
        if (!board || boardNotLoaded) return;

        unloadPreviews(board);
    }, [board, boardNotLoaded, unloadPreviews]);

    useEffect(() => {
        if (!board || !threadNumber || !loading) return;

        fetchThreadByNumber(board, Number(threadNumber))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [board, thread, threadNumber, fetchThreadByNumber, loading]);

    if (!board || !threadNumber) return null;
    if (!thread) return loading ? <p>Ladataan...</p> : <NotFoundPage />;

    const quotePost = (postId: number) => {
        replyFormRef?.current?.quotePost(postId);
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
                            <span className="text-gray-500 bold">Langan aloitusviesti on poistettu.</span>
                            <br />
                        </>
                    )}

                    {opPost && (
                        <>
                            {opPost.file && <span className="text-gray-400 text-xs ml-1">{`Tiedosto: ${opPost.file.name}, ${opPost.file.size} KB`}</span>}
                            <div className="mb-1 p-1 sm:p-0 w-full sm:max-w-[96%] border-2 border-purple-200 sm:border-none bg-white sm:bg-transparent">
                                <PostBoxBody thread={thread} post={opPost} quotePost={quotePost} />
                                <div className="clear-both sm:clear-none" />
                            </div>
                        </>
                    )}

                    {replies.map((reply) => (
                        <React.Fragment key={reply.id}>
                            <div
                                className={`overflow-hidden border-2 ${reply.number === highlightedMessage ? "border-purple-500" : "border-purple-200"} bg-white p-1 block sm:inline-block w-full sm:w-auto sm:max-w-[96%] break-words`}
                                key={reply.id}
                                id={`${reply.id}`}
                            >
                                <PostBoxBody
                                    thread={thread}
                                    post={reply}
                                    quotePost={quotePost}
                                />
                            </div>
                            <br />
                        </React.Fragment>
                    ))}

                    {loading
                        ? <i>Ladataan vastauksia...</i>
                        : <ReplyForm thread={thread} ref={replyFormRef} />}
                </article>
            </main>
        </>
    );
}
