import React from "react";
import ReplyIcon from "@heroicons/react/solid/ReplyIcon";
import PhotographIcon from "@heroicons/react/solid/PhotographIcon";
import { Link } from "react-router-dom";

import { CatalogThread } from "../types";
import useBoards from "../hooks/useBoards";
import formatPost from "../utils/formatPost";
import useTimeAgo from "../hooks/useTimeAgo";

interface Props {
    thread: CatalogThread;
}

export default function AllThreadsBox({
    thread: {
        posts: [opPost],
        ...thread
    },
}: Props) {
    const { boards } = useBoards();
    const board = boards?.find((b) => b.id === thread.board);

    const timeAgo = useTimeAgo(opPost?.createdAt ?? thread.bumpedAt);

    if (!board) return null;

    return (
        <div
            className="bg-white p-2 h-72 border-2 border-purple-200 flex flex-col justify-between h-100 overflow-hidden break-words"
            key={thread.id}
            tabIndex={new Date(thread.bumpedAt).getTime()}
        >
            <Link
                className="text-black shrink overflow-hidden grow"
                to={`/${board.path}/${thread.number}`}
            >
                <span className="text-xs text-indigo-500">
                    /{board.path}/ - {board.name}
                </span>

                {opPost?.file && (
                    <img
                        src={`/files/lauta-thumbnails/${opPost.id}.png`}
                        alt=""
                        className="mx-auto rounded"
                    />
                )}

                <div className="p-1 h-full">
                    <h4 className="text-lg">{thread.title}</h4>
                    {opPost?.number === thread.number ? (
                        opPost.text && formatPost(opPost.text.slice(0, 100))
                    ) : (
                        <span className="text-gray-500 bold">
                            Langan aloitusviesti on poistettu.
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex p-1 justify-between text-gray-400 text-xs bg-white w-full shrink-0 grow-0">
                <span className="shrink">{timeAgo}</span>
                <span className="ml-2">
                    <span>
                        <ReplyIcon className="inline-block h-3 w-3 mr-1" />
                        {thread.replyCount}
                    </span>
                    {thread.fileReplyCount > 0 && (
                        <span>
                            <PhotographIcon className="inline-block h-3 w-3 ml-1 mr-1" />
                            {thread.fileReplyCount}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
}
