import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
// TODO: NÄä fiksummin
import {
    PhotographIcon,
    PlusIcon,
    RefreshIcon,
    ReplyIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";

import useBoard from "../hooks/useBoard";
import BoardHeader from "./BoardHeader";
import ThreadForm, { Ref as ThreadFormRef } from "./forms/ThreadForm";
import useCatalog from "../hooks/useCatalog";
import formatTimeAgo from "../utils/formatTimeAgo";
import formatPost from "../utils/formatPost";

export default function BoardIndex() {
    const threadFormRef = useRef<ThreadFormRef>(null);
    const [formHidden, setFormHidden] = useState(true);
    const board = useBoard();
    const { threads, create: createThread } = useCatalog(board);

    if (!board || !threads) return null;

    const openForm = () => {
        setFormHidden(false);
        threadFormRef?.current?.focusTextarea();
    };

    return (
        <>
            <Helmet>
                <title>{`/${board.path}/ - ${board.name} - Lauta`}</title>
            </Helmet>

            <BoardHeader />

            <div className="text-right text-gray-400 p-1">
                {" [ "}
                <button
                    className="text-indigo-500 hover:text-indigo-700 hover:underline"
                    type="button"
                >
                    <RefreshIcon className="inline-block h-3 w-3 mr-1" />
                    Päivitä
                </button>
                {" ] "}

                {" [ "}
                <button
                    className="text-indigo-500 hover:text-indigo-700 hover:underline"
                    type="button"
                    onClick={() => openForm()}
                >
                    <PlusIcon className="inline-block h-3 w-3 mr-1" />
                    Uusi
                </button>
                {" ] "}
            </div>

            {!formHidden && (
                <ThreadForm
                    ref={threadFormRef}
                    trigger={createThread}
                    board={board}
                />
            )}

            <main>
                {!threads?.length && <p>Täällä on tyhjää.</p>}

                <div className="text-clip break-words overflow-clip shadowed grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[275px] m-2">
                    {threads?.map(
                        ({ posts: [opPost], ...thread }) =>
                            opPost && (
                                <div
                                    className="bg-white border-2 border-purple-200 relative"
                                    key={thread.id}
                                >
                                    <Link
                                        className="text-black"
                                        to={`/${board.path}/${thread.number}`}
                                    >
                                        {opPost.file && (
                                            <img
                                                src={`/files/lauta-thumbnails/${opPost.id}.png`}
                                                alt=""
                                                className="mx-auto"
                                            />
                                        )}
                                        <div className="p-1 h-full">
                                            <h4 className="text-xl">
                                                {thread.title}
                                            </h4>
                                            {opPost.number === thread.number ? (
                                                opPost.text &&
                                                formatPost(
                                                    opPost.text.slice(0, 100)
                                                )
                                            ) : (
                                                <span className="text-gray-500 bold">
                                                    Langan aloitusviesti on
                                                    poistettu.
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="flex p-1 justify-between text-gray-400 text-sm bottom-0 left-0 bg-white w-full absolute">
                                        <span>
                                            {formatTimeAgo(opPost.createdAt)}
                                        </span>
                                        <span>
                                            <ReplyIcon className="inline-block h-3 w-3 mr-1" />
                                            {thread.replyCount}
                                            <PhotographIcon className="inline-block h-3 w-3 ml-1 mr-1" />
                                            {thread.fileReplyCount}
                                        </span>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </main>
        </>
    );
}
