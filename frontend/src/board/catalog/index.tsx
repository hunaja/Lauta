import React from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";

import useBoard from "../use_board";
import BoardHeader from "../../header";
import useCatalog from "../use_catalog";
import BoardIndexBox from "./box";
import LoadingSpinner from "../../spinner";
import NotFoundPage from "../../front/not_found";
import ThreadListHeader from "../thread_list_header";

export default function BoardCatalog() {
    const board = useBoard();

    // TODO: Oma hookki tälle?
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const {
        threads,
        create: createThread,
        error,
    } = useCatalog(board, page, "catalog");

    if (!board) return null;

    if (error) {
        return <NotFoundPage />;
    }

    if (!threads) {
        return (
            <div className="h-screen w-screen flex-col flex">
                <BoardHeader />
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`/${board.path}/ - ${board.name} - Lauta`}</title>
            </Helmet>

            <BoardHeader />

            <ThreadListHeader
                board={board}
                createThread={createThread}
                currentMode="catalog"
            />

            {!threads.length && (
                <div className="flex grow align-center place-center items-center justify-center">
                    <i>Ei lankoja.</i>
                </div>
            )}

            {threads.length && (
                <main className="m-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {threads?.map((t) => (
                        <BoardIndexBox key={t.id} thread={t} />
                    ))}
                </main>
            )}
        </>
    );
}
