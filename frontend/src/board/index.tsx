import React from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";

import useBoard from "./use_board";
import BoardHeader from "../header";
import useCatalog from "./use_catalog";
import LoadingSpinner from "../spinner";
import NotFoundPage from "../front/not_found";
import ThreadListHeader from "./thread_list_header";
import ThreadListThread from "./list_thread";

// Container for the board index page.
export default function BoardIndex() {
    const board = useBoard();

    // TODO: Oma hookki tälle?
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const { threads, create: createThread, error } = useCatalog(board, page);

    if (!board) return null;
    if (error) return <NotFoundPage />;

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
                <title>{`/${board.path}/ - ${board.name}`}</title>
            </Helmet>

            <BoardHeader />

            <ThreadListHeader board={board} createThread={createThread} />

            {!threads.length && (
                <div className="flex grow align-center place-center items-center justify-center">
                    <i>Ei lankoja.</i>
                </div>
            )}

            {threads.length > 0 && (
                <main>
                    {threads?.map((t) => (
                        <>
                            <ThreadListThread
                                key={t.id}
                                thread={t}
                                board={board}
                            />
                            <div className="clear-both" />
                            <br />
                        </>
                    ))}
                </main>
            )}
        </>
    );
}
