import React from "react";
import { Link } from "react-router-dom";
import { PhotographIcon, ReplyIcon } from "@heroicons/react/solid";
import useBoard from "../hooks/useBoard";
import formatTimeAgo from "../utils/formatTimeAgo";
import useStore from "../hooks/useStore";
import renderPostContent from "../utils/renderPostContent";

export default function BoardCatalog() {
    const board = useBoard();
    const thumbnailPath = useStore((state) => state.imageboardConfig?.thumbnailPath);
    const threads = useStore((state) => board
        && state.threads
            .filter((t) => t.board === board.id)
            .sort((a, b) => {
                const ad = new Date(a.bumpedAt).getTime();
                const bd = new Date(b.bumpedAt).getTime();

                return bd - ad;
            }));

    if (!board || !threads || !thumbnailPath) return null;

    return (
        <>
            {!threads?.length && <p>Täällä on tyhjää.</p>}

            <div className="text-clip break-words overflow-clip shadowed grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[275px] m-2">
                {threads?.map((thread) => thread.posts.length > 0 && (
                    <div className="bg-white border-2 border-purple-200 relative" key={thread.id}>
                        <Link className="text-black" to={`/${board.path}/${thread.number}`}>
                            {thread.posts[0].file && (
                                <img
                                    src={`${thumbnailPath}/${thread.posts[0].id}.png`}
                                    alt=""
                                    className="mx-auto"
                                />
                            )}
                            <div className="p-1 h-full">
                                <h4 className="text-xl">{thread.title}</h4>
                                {thread.posts[0].number === thread.number
                                    ? (thread.posts[0].text
                                            && renderPostContent(thread.posts[0].text))
                                    : <span className="text-gray-500 bold">Langan aloitusviesti on poistettu.</span>}
                            </div>
                        </Link>

                        <div className="flex p-1 justify-between text-gray-400 text-sm bottom-0 left-0 bg-white w-full absolute">
                            <span>{formatTimeAgo(thread.posts[0].createdAt)}</span>
                            <span>
                                <ReplyIcon className="inline-block h-3 w-3 mr-1" />
                                {thread.replyCount}
                                <PhotographIcon className="inline-block h-3 w-3 ml-1 mr-1" />
                                {thread.fileReplyCount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
