import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useBoard from "../use_board";
import { Post, Thread } from "../../types";
import formatPost from "../format_post";
import PostBoxFloating from "./box_floating";
import PostBoxFloatingFromId from "./box_floating_from_id";
import useTimeAgo from "../use_time_ago";
import PopupButton from "./popup_button";

interface Props {
    thread: Thread;
    post: Post;
    quotePost: (postNumber: number) => void;
    deletePost: (post: Post) => Promise<void>;
    deletePostFile: (post: Post) => Promise<void>;
    setHighlightedMessage: (postNumber: number) => void;
    deleteThread?: (thread: Thread) => Promise<void>;
    preview?: boolean;
}

export default function PostBoxThread({
    thread,
    post,
    quotePost,
    deletePost,
    deletePostFile,
    setHighlightedMessage,
    deleteThread,
    preview = false,
}: Props) {
    const navigate = useNavigate();

    const board = useBoard();

    const [imageOpened, setImageOpened] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const timeAgo = useTimeAgo(post.createdAt);

    if (!board || !thread) return null;

    const onIdClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        number: number
    ) => {
        if (preview) return;
        event.preventDefault();
        quotePost(number);
    };

    // TODO: Does this really work
    const authorColor = () => {
        if (post.saging) return "text-purple-700";
        if (post.author !== "Anonyymi") return "text-purple-500";
        return "text-purple-300";
    };

    const toggleImageOpened = () => {
        setImageLoaded(imageOpened);
        setImageOpened(!imageOpened);
    };

    const renderPostBox = (postNumber: number) => {
        const boxPost = thread.posts.find((p) => p.number === postNumber);
        if (!boxPost) return <PostBoxFloatingFromId postNumber={postNumber} />;

        return <PostBoxFloating thread={thread} post={boxPost} />;
    };

    const onQuoteClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        number: number
    ) => {
        if (thread.posts.some((p) => p.number === number) && !preview) {
            event.preventDefault();
            navigate(`#${number}`);
            setHighlightedMessage(number);
        }
    };

    const isOp = thread?.number === post.number;

    const fullUrl = `/api/posts/${post.id}/file`;

    return (
        <>
            {isOp && post.file && (
                <>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,
                         jsx-a11y/click-events-have-key-events */}
                    <aside
                        className="float-left m-1 cursor-pointer hidden sm:block"
                        onClick={() => toggleImageOpened()}
                    >
                        <img
                            src={
                                imageOpened
                                    ? fullUrl
                                    : `/files/lauta-opthumbnails/${post.id}.png`
                            }
                            alt=""
                            loading="lazy"
                            onLoad={() => imageOpened && setImageLoaded(true)}
                        />
                    </aside>
                    {imageOpened && imageLoaded && (
                        <div className="clear-both" />
                    )}
                </>
            )}

            <div
                className={`text-sm text-gray-500 ${
                    isOp && post.file && !imageOpened ? "pl-5" : ""
                }`}
            >
                <b className={`${authorColor()}`}>
                    {post.author ?? "Anonyymi"}
                </b>
                {" • "}
                <Link
                    to={`/${board.path}/${thread.number}#${post.number}`}
                    onClick={(event) => onIdClick(event, post.number)}
                >
                    {`No. ${post.number}`}
                </Link>
                {" • "}
                <time>{timeAgo}</time>

                <PopupButton
                    post={post}
                    thread={thread}
                    deletePost={deletePost}
                    deleteFile={deletePostFile}
                    deleteThread={deleteThread}
                />

                {post.file &&
                    (isOp ? (
                        <>
                            <br />
                            <span className="text-gray-400 text-xs">{`Tiedosto: ${post.file.name}, ${post.file.size} KB`}</span>
                        </>
                    ) : (
                        <>
                            <br />
                            <span className="text-gray-400 text-xs">{`Tiedosto: ${post.file.name}, ${post.file.size} KB`}</span>
                        </>
                    ))}
            </div>

            {post.file && (
                <>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,
                         jsx-a11y/click-events-have-key-events */}
                    <aside
                        className={`float-left block mr-1 cursor-pointer ${
                            isOp ? "block sm:hidden " : ""
                        }`}
                        onClick={() => toggleImageOpened()}
                    >
                        <img
                            src={
                                imageOpened
                                    ? fullUrl
                                    : `/files/lauta-thumbnails/${post.id}.png`
                            }
                            alt=""
                            loading="lazy"
                            onLoad={() => imageOpened && setImageLoaded(true)}
                        />
                    </aside>
                    {imageOpened && imageLoaded && (
                        <div className="clear-both" />
                    )}
                </>
            )}
            <div className="block overflow-hidden">
                <h2 className="text-xl">{isOp && thread.title}</h2>
                <blockquote>
                    {formatPost(
                        post.text,
                        (id) => renderPostBox(id),
                        (event, id) => onQuoteClick(event, id)
                    )}
                </blockquote>
            </div>
        </>
    );
}

PostBoxThread.defaultProps = {
    deleteThread: undefined,
    preview: false,
};
