import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router";

import useBoard from "../hooks/useBoard";

import BoardHeader from "./BoardHeader";
// import NotFoundPage from "./NotFoundPage";
import ReplyForm, { Ref as ReplyFormRef } from "./forms/ReplyForm";
import PostBoxBody from "./PostBoxBody";
import useThread from "../hooks/useThread";

export default function ThreadPage() {
    const replyFormRef = useRef<ReplyFormRef>(null);

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
    } = useThread(board, threadNumber);

    useEffect(() => {
        if (highlightedMessage === null) return;

        const clearHighlightedMessage = setTimeout(() => {
            setHighlightedMessage(null);
        }, 2000);

        // eslint-disable-next-line consistent-return
        return () => clearTimeout(clearHighlightedMessage);
    }, [highlightedMessage]);

    if (!board || !threadNumber) return null;

    // TODO: Show loading indicator
    if (!thread) return <p>Ladataan...</p>;

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
                            <span className="text-gray-500 bold">
                                Langan aloitusviesti on poistettu.
                            </span>
                            <br />
                        </>
                    )}

                    {opPost && (
                        <>
                            {opPost.file && (
                                <span className="text-gray-400 text-xs ml-1">{`Tiedosto: ${opPost.file.name}, ${opPost.file.size} KB`}</span>
                            )}
                            <div className="mb-1 p-1 sm:p-0 w-full sm:max-w-[96%] border-2 border-purple-200 sm:border-none bg-white sm:bg-transparent">
                                <PostBoxBody
                                    thread={thread}
                                    post={opPost}
                                    quotePost={quotePost}
                                    deletePost={deletePost}
                                    deletePostFile={deletePostFile}
                                />
                                <div className="clear-both sm:clear-none" />
                            </div>
                        </>
                    )}

                    {replies.map((reply) => (
                        <React.Fragment key={reply.id}>
                            <div
                                className={`overflow-hidden border-2 ${
                                    reply.number === highlightedMessage
                                        ? "border-purple-500"
                                        : "border-purple-200"
                                } bg-white p-1 block sm:inline-block w-full sm:w-auto sm:max-w-[96%] break-words`}
                                key={reply.id}
                                id={`${reply.id}`}
                            >
                                <PostBoxBody
                                    thread={thread}
                                    post={reply}
                                    quotePost={quotePost}
                                    deletePost={deletePost}
                                    deletePostFile={deletePostFile}
                                />
                            </div>
                            <br />
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
