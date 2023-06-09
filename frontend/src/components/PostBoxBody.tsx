import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useBoard from "../hooks/useBoard";
import useStore from "../hooks/useStore";
import { Post, Thread } from "../types";
import formatTimeAgo from "../utils/formatTimeAgo";
import renderPostContent from "../utils/renderPostContent";

interface PostBoxBodyProps {
    thread?: Thread;
    post: Post;
    quotePost?: (postNumber: number) => void;
}

// TODO: Needs refactor

export default function PostBoxBody({
    thread,
    post,
    quotePost,
}: PostBoxBodyProps) {
    const board = useBoard();
    const popupRef = useRef<HTMLDivElement>(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [imageOpened, setImageOpened] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const sysopPermissions = useStore(
        (state) => state.authorizedUser?.role === "SOPSY"
    );
    const imageboardConfig = useStore((state) => state.imageboardConfig);
    const deletePost = useStore((state) => state.deletePost);
    const deleteFile = useStore((state) => state.deletePostFile);

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

    if (!board || !imageboardConfig || !thread) return null;

    const onIdClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        number: number
    ) => {
        event.preventDefault();
        if (quotePost) quotePost(number);
    };

    const authorColor = () => {
        if (post.saging) return "text-purple-700";
        if (post.author && post.author !== "Anonyymi") return "text-purple-500";
        return "text-purple-400";
    };

    const onDeletePostClick = () => {
        deletePost(thread, post);
    };

    const onDeleteFileClick = () => {
        deleteFile(thread, post);
        setPopupOpen(false);
    };

    const toggleImageOpened = () => {
        setImageLoaded(imageOpened);
        setImageOpened(!imageOpened);
    };

    const isOp = thread?.number === post.number;

    const imageUrl = imageOpened
        ? `/api/posts/${post.id}/file`
        : `${
              isOp
                  ? imageboardConfig.opThumbnailPath
                  : imageboardConfig.thumbnailPath
          }/${post.id}.png`;

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
                            src={imageUrl}
                            alt=""
                            loading="lazy"
                            onLoad={() => imageOpened && setImageLoaded(true)}
                        />
                    </aside>
                    {imageOpened && imageLoaded && (
                        <br className="clear-both" />
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
                <time>{formatTimeAgo(post.createdAt)}</time>
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
                            {sysopPermissions && (
                                <>
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

                {!isOp && post.file && (
                    <>
                        <br />
                        <span className="text-gray-400 text-xs ml-1">{`Tiedosto: ${post.file.name}, ${post.file.size} KB`}</span>
                    </>
                )}
            </div>

            {!isOp && post.file && (
                <>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,
                         jsx-a11y/click-events-have-key-events */}
                    <aside
                        className="float-left block mr-1 cursor-pointer"
                        onClick={() => toggleImageOpened()}
                    >
                        <img
                            src={imageUrl}
                            alt=""
                            loading="lazy"
                            onLoad={() => imageOpened && setImageLoaded(true)}
                        />
                    </aside>
                    {imageOpened && imageLoaded && (
                        <br className="clear-both" />
                    )}
                </>
            )}
            <div className="block overflow-hidden">
                <h2 className="text-xl">{isOp && thread.title}</h2>
                <blockquote>{renderPostContent(post.text)}</blockquote>
            </div>
        </>
    );
}

PostBoxBody.defaultProps = {
    thread: undefined,
    quotePost: undefined,
};
