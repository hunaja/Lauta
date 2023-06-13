import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useBoard from "../hooks/useBoard";
import useAuthStore from "../hooks/useAuthStore";
import { Post, Thread, UserRole } from "../types";
import formatPost from "../utils/formatPost";
import PostBoxFloating from "./PostBoxFloating";
import PostBoxFloatingFromId from "./PostBoxFloatingFromId";
import useTimeAgo from "../hooks/useTimeAgo";

interface Props {
    thread: Thread;
    post: Post;
    quotePost: (postNumber: number) => void;
    deletePost: (post: Post) => Promise<void>;
    deletePostFile: (post: Post) => Promise<void>;
    setHighlightedMessage: (postNumber: number) => void;
    deleteThread?: (thread: Thread) => Promise<void>;
}

export default function PostBoxThread({
    thread,
    post,
    quotePost,
    deletePost,
    deletePostFile,
    setHighlightedMessage,
    deleteThread,
}: Props) {
    const navigate = useNavigate();

    const board = useBoard();
    const popupRef = useRef<HTMLDivElement>(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [imageOpened, setImageOpened] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isAdmin = useAuthStore(
        (state) => state.authorizedUser?.role === UserRole.ADMIN
    );
    const timeAgo = useTimeAgo(post.createdAt);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setPopupOpen]);

    if (!board || !thread) return null;

    const onIdClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        number: number
    ) => {
        event.preventDefault();
        quotePost(number);
    };

    const authorColor = () => {
        if (post.saging) return "text-purple-700";
        if (post.author && post.author !== "Anonyymi") return "text-purple-500";
        return "text-purple-300";
    };

    const onDeletePostClick = () => {
        deletePost(post);
    };

    const onDeleteFileClick = () => {
        deletePostFile(post);
        setPopupOpen(false);
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
        if (thread.posts.some((p) => p.number === number)) {
            event.preventDefault();
            navigate(`#${number}`);
            setHighlightedMessage(number);
        }
    };

    const onDeleteThreadClick = () => {
        deleteThread?.(thread);
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

            <div className="text-sm text-gray-500">
                <b className={`${authorColor()}`}>
                    {post.author ?? "Anonyymi"}
                </b>
                {" • "}
                <Link
                    to={`#${post.number}`}
                    onClick={(event) => onIdClick(event, post.number)}
                >
                    {`No. ${post.number}`}
                </Link>
                {" • "}
                <time>{timeAgo}</time>
                <button
                    type="button"
                    className="text-indigo-500 hover:text-indigo-700 hover:underline"
                    onClick={() => !popupOpen && setPopupOpen(true)}
                >
                    {!popupOpen ? (
                        <ChevronDownIcon className="inline-block h-3 w-3 ml-1" />
                    ) : (
                        <ChevronRightIcon className="text-indigo-700 inline-block h-3 w-3 ml-1" />
                    )}
                </button>

                {popupOpen && (
                    <div
                        className="absolute inline-block z-10 border-2 text-sm border-purple-400 bg-white"
                        ref={popupRef}
                    >
                        <ul className="text-indigo-700">
                            <li>
                                <button
                                    type="button"
                                    className="pl-1 pr-1 w-full hover:text-indigo-500 hover:bg-gray-200"
                                >
                                    Vinkkaa
                                </button>
                            </li>

                            {isAdmin && (
                                <>
                                    {thread.number === post.number && (
                                        <li>
                                            <button
                                                onClick={() =>
                                                    onDeleteThreadClick()
                                                }
                                                type="button"
                                                className="pl-1 pr-1 w-full hover:text-indigo-500 hover:bg-gray-200"
                                            >
                                                Poista lanka
                                            </button>
                                        </li>
                                    )}

                                    <li>
                                        <button
                                            onClick={() => onDeletePostClick()}
                                            type="button"
                                            className="pl-1 pr-1 w-full hover:text-indigo-500 hover:bg-gray-200"
                                        >
                                            Poista viesti
                                        </button>
                                    </li>

                                    {post.file && (
                                        <li>
                                            <button
                                                onClick={() =>
                                                    onDeleteFileClick()
                                                }
                                                type="button"
                                                className="pl-1 pr-1 w-full hover:text-indigo-500 hover:bg-gray-200"
                                            >
                                                Poista kuva
                                            </button>
                                        </li>
                                    )}
                                </>
                            )}
                        </ul>
                    </div>
                )}

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
};
