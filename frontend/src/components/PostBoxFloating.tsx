import React from "react";
import { Link } from "react-router-dom";
import useBoard from "../hooks/useBoard";
import { Post, Thread } from "../types";
import formatTimeAgo from "../utils/formatTimeAgo";
import formatPost from "../utils/formatPost";

interface Props {
    thread: Pick<Thread, "number" | "title">;
    post: Post;
}

export default function PostBoxFloating({ thread, post }: Props) {
    const board = useBoard();

    if (!board || !thread) return null;

    const authorColor = () => {
        if (post.saging) return "text-purple-700";
        if (post.author && post.author !== "Anonyymi") return "text-purple-500";
        return "text-purple-400";
    };

    const isOp = thread?.number === post.number;

    const imageUrl = `/files/lauta-thumbnails/${post.id}.png`;

    return (
        <>
            <div className="text-sm text-gray-500">
                <b className={`${authorColor()}`}>
                    {post.author ?? "Anonyymi"}
                </b>
                {" • "}
                <Link to={`#${post.number}`}>{`No. ${post.number}`}</Link>
                {" • "}
                <time>{formatTimeAgo(post.createdAt)}</time>

                {post.file && (
                    <>
                        <br />
                        <span className="text-gray-400 text-xs ml-1">{`Tiedosto: ${post.file.name}, ${post.file.size} KB`}</span>
                    </>
                )}
            </div>

            {post.file && (
                <>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,
                         jsx-a11y/click-events-have-key-events */}
                    <aside className="float-left block mr-1 cursor-pointer">
                        <img src={imageUrl} alt="" loading="lazy" />
                    </aside>
                </>
            )}
            <div className="block overflow-hidden">
                <h2 className="text-xl">{isOp && thread.title}</h2>
                <blockquote>{formatPost(post.text)}</blockquote>
            </div>
        </>
    );
}
