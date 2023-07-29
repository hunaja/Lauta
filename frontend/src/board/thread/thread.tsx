import React, { useEffect, useRef, useState } from "react";
import { PhotographIcon, ReplyIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

import ReplyForm, { Ref as ReplyFormRef } from "./form";
import PostBoxBody from "./box";
import { Post, PostForm, Thread as ThreadType } from "../../types";
import PopupButton from "./popup_button";

export default function Thread({
    thread,
    highlighted,
    deletePost,
    deletePostFile,
    deleteThread,
    openPreview,
    reply,
    preview = false,
}: {
    thread: ThreadType;
    // eslint-disable-next-line react/require-default-props
    deletePost: (post: Post) => Promise<void>;
    deletePostFile: (post: Post) => Promise<void>;
    deleteThread: (thread1: ThreadType) => Promise<void>;
    reply: (form: PostForm) => Promise<Post>;
    openPreview?: () => void;
    highlighted?: number;
    preview?: boolean;
}) {
    const replyFormRef = useRef<ReplyFormRef>(null);

    const highlightedRef = useRef<HTMLDivElement | null>(null);
    const [highlightedRefReady, setHighlightedRefReady] = useState(false);
    const [highlightedMessage, setHighlightedMessage] = useState<
        number | undefined
    >(highlighted);

    const opPost = thread.posts.find((p) => p.id === thread.id);
    const replies = thread.posts.filter((p) => p.id !== thread.id);

    const quotePost = (postId: number) => {
        replyFormRef?.current?.quotePost(postId);
    };

    useEffect(() => {
        if (typeof highlightedMessage === "undefined" || !highlightedRefReady)
            return;

        highlightedRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        const clearHighlightedMessage = setTimeout(() => {
            setHighlightedMessage(undefined);
        }, 3000);

        // eslint-disable-next-line consistent-return
        return () => clearTimeout(clearHighlightedMessage);
    }, [highlightedMessage, highlightedRefReady]);

    return (
        <article className="p-2">
            {!opPost && (
                <>
                    <div className="text-sm text-gray-500">
                        <b className="text-purple-300">Anonyymi</b>
                        {" • "}
                        <Link to={`#${thread.id}`}>{`No. ${thread.id}`}</Link>
                        {" • "}

                        <PopupButton
                            thread={thread}
                            deletePost={deletePost}
                            deleteFile={deletePostFile}
                            deleteThread={deleteThread}
                        />
                    </div>
                    {thread.title && (
                        <h2 className="text-xl">{thread.title}</h2>
                    )}
                    <span className="text-gray-500 bold">
                        Langan aloitusviesti on poistettu.
                    </span>
                    <br />
                </>
            )}

            {opPost && (
                <div
                    className="sm:mb-0 w-full sm:max-w-[96%] border-2 border-purple-200 sm:border-none bg-white sm:bg-transparent"
                    ref={
                        opPost.id === highlightedMessage
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
                        preview={preview}
                    />
                    <div className="clear-both sm:clear-none" />
                </div>
            )}

            <div className="p-1 text-sm text-gray-500 flex">
                {preview &&
                    thread.replyCount > 6 &&
                    thread.posts.length === 6 && (
                        <button
                            type="button"
                            className="text-purple-500 hover:text-purple-700 hover:underline"
                            onClick={openPreview}
                        >
                            Kaikki Vastaukset
                        </button>
                    )}

                <span>
                    <ReplyIcon className="inline-block h-3 w-3 mr-2 ml-2" />
                    {thread.replyCount}
                </span>
                {thread.fileReplyCount > 0 && (
                    <span>
                        <PhotographIcon className="inline-block h-3 w-3 ml-2 mr-2" />
                        {thread.fileReplyCount}
                    </span>
                )}
            </div>

            {replies.map((reply1) => (
                <React.Fragment key={reply1.id}>
                    <div
                        className={`mb-1 sm:mb-0 overflow-hidden border-2 ${
                            reply1.id === highlightedMessage
                                ? "border-purple-500"
                                : "border-purple-200"
                        } bg-white p-1 block sm:inline-block w-full sm:w-auto sm:max-w-[96%] break-words`}
                        key={reply1.id}
                        id={`${reply1.id}`}
                        ref={(ref) => {
                            if (reply1.id === highlightedMessage) {
                                highlightedRef.current = ref;

                                setHighlightedRefReady(true);
                            }
                        }}
                    >
                        <PostBoxBody
                            thread={thread}
                            post={reply1}
                            quotePost={quotePost}
                            deletePost={deletePost}
                            deletePostFile={deletePostFile}
                            setHighlightedMessage={setHighlightedMessage}
                            preview={preview}
                        />
                    </div>
                    <br className="hidden sm:block" />
                </React.Fragment>
            ))}

            {!preview &&
                (!replies ? (
                    <i>Ladataan vastauksia...</i>
                ) : (
                    <ReplyForm replyThread={reply} ref={replyFormRef} />
                ))}
        </article>
    );
}

Thread.defaultProps = {
    highlighted: undefined,
    preview: false,
    openPreview: undefined,
};
