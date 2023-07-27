import React from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";

import BoardHeader from "../header";
import NotFoundPage from "../front/not_found";
import LoadingSpinner from "../spinner";
import useAllCatalog from "./use_catalog";
import AllThreadsBox from "./box";

export default function AllThreads() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const { threads, error } = useAllCatalog(page);

    if (error) {
        return <NotFoundPage />;
    }

    if (!threads) {
        return (
            <div className="h-screen w-screen flex-col flex">
                <BoardHeader showBoardHeader={false}>
                    <div className="text-center py-5">
                        <h1 className="text-xl">Ukko</h1>
                        <h3 className="text-xl2">Kaikki langat</h3>
                    </div>
                </BoardHeader>
                <LoadingSpinner />
            </div>
        );
    }

    const handlePageChange = (pageId: number) => {
        const params = new URLSearchParams();
        if (pageId > 1) params.set("page", pageId.toString());

        setSearchParams(params);
    };

    return (
        <>
            <Helmet>
                <title>/ukko/ - Kaikki Langat - Lauta</title>
            </Helmet>

            <BoardHeader showBoardHeader={false}>
                <div className="text-center py-5">
                    <h1 className="text-xl">Ukko</h1>
                    <h3 className="text-xl2">Kaikki langat</h3>
                </div>
            </BoardHeader>

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
            </div>

            {!threads?.length && (
                <div className="flex grow align-center place-center items-center justify-center">
                    <i>Ei lankoja.</i>
                </div>
            )}

            {threads.length > 0 && (
                <main className="m-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {threads?.map((t) => (
                        <AllThreadsBox key={t.id} thread={t} />
                    ))}
                </main>
            )}
        </>
    );
}
