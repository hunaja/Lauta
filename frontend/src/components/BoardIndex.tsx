import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
// TODO: NÄä fiksummin
import {
    PhotographIcon,
    PlusIcon,
    RefreshIcon,
    ReplyIcon,
} from "@heroicons/react/solid";
import { Link, useSearchParams } from "react-router-dom";

import useBoard from "../hooks/useBoard";
import BoardHeader from "./BoardHeader";
import ThreadForm, { Ref as ThreadFormRef } from "./forms/ThreadForm";
import useCatalog from "../hooks/useCatalog";
import formatTimeAgo from "../utils/formatTimeAgo";
import formatPost from "../utils/formatPost";
import NotFoundPage from "./NotFoundPage";
import LoadingSpinner from "./LoadingSpinner";

export default function BoardIndex() {
    const threadFormRef = useRef<ThreadFormRef>(null);
    const [formHidden, setFormHidden] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const board = useBoard();
    const {
        threads,
        create: createThread,
        error,
        update,
        validating,
    } = useCatalog(board, page);

    if (!board) return null;

    const openForm = () => {
        setFormHidden(false);
        threadFormRef?.current?.focusTextarea();
    };

    if (error) {
        return <NotFoundPage />;
    }

    if (!threads) {
        return (
            <div className="h-screen w-screen flex-col flex">
                {board && <BoardHeader />}
                <LoadingSpinner />
            </div>
        );
    }

    const handleRefresh = () => {
        update();
    };

    const handlePageChange = (pageId: number) => {
        const params = new URLSearchParams();
        if (pageId > 1) params.set("page", pageId.toString());

        setSearchParams(params);
    };

    return (
        <div className="flex flex-col h-screen w-screen">
            <Helmet>
                <title>{`/${board.path}/ - ${board.name} - Lauta`}</title>
            </Helmet>

            <BoardHeader />

            <div className="flex justify-between text-gray-400 p-1">
                <div>
                    Sivu:
                    {Array.from({ length: page + 2 }, (_, i) => i + 1).map(
                        (i) => (
                            <>
                                {" [ "}
                                <button
                                    className="text-indigo-500 hover:text-indigo-700 hover:underline"
                                    type="button"
                                    onClick={() => handlePageChange(i)}
                                >
                                    {i}
                                </button>
                                {" ]"}
                            </>
                        )
                    )}
                </div>
                <div>
                    {" [ "}
                    <button
                        className="text-indigo-500 hover:text-indigo-700 hover:underline"
                        type="button"
                        onClick={() => handleRefresh()}
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
            </div>

            {!formHidden && (
                <ThreadForm
                    ref={threadFormRef}
                    trigger={createThread}
                    board={board}
                />
            )}

            {validating ? (
                <LoadingSpinner />
            ) : (
                <main>
                    {!threads?.length && <p>Täällä on tyhjää.</p>}
                    <div className="text-clip break-words overflow-clip m-2 grid grid-cols-auto-fit gap-2 w-100 overflow-hidden">
                        {threads?.map(
                            ({ posts: [opPost], ...thread }) =>
                                opPost && (
                                    <div
                                        className="bg-white border-2 border-purple-200 flex flex-col justify-between h-100 overflow-hidden"
                                        key={thread.id}
                                        tabIndex={thread.bumpedAt}
                                    >
                                        <Link
                                            className="text-black shrink overflow-hidden grow"
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
                                                {opPost.number ===
                                                thread.number ? (
                                                    opPost.text &&
                                                    formatPost(
                                                        opPost.text.slice(
                                                            0,
                                                            100
                                                        )
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 bold">
                                                        Langan aloitusviesti on
                                                        poistettu.
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="flex p-1 justify-between text-gray-400 text-sm bg-white w-full shrink-0 grow-0">
                                            <span>
                                                {formatTimeAgo(
                                                    opPost.createdAt
                                                )}
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
            )}
        </div>
    );
}
