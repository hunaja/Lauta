import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import RefreshIcon from "@heroicons/react/solid/RefreshIcon";
import PlusIcon from "@heroicons/react/solid/PlusIcon";

import useBoard from "../hooks/useBoard";
import BoardHeader from "./BoardHeader";
import ThreadForm, { Ref as ThreadFormRef } from "./forms/ThreadForm";
import useCatalog from "../hooks/useCatalog";
import NotFoundPage from "./NotFoundPage";
import LoadingSpinner from "./LoadingSpinner";
import BoardIndexBox from "./BoardIndexBox";

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
        <>
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

            {validating && <LoadingSpinner />}

            {!validating && (
                <>
                    {!threads?.length && (
                        <div className="flex grow align-center place-center items-center justify-center">
                            <i>Ei lankoja.</i>
                        </div>
                    )}

                    {threads.length > 0 && (
                        <main className="m-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                            {threads?.map((t) => (
                                <BoardIndexBox key={t.id} thread={t} />
                            ))}
                        </main>
                    )}
                </>
            )}
        </>
    );
}
