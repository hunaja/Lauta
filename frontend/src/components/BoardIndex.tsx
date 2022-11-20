import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid";
import useBoard from "../hooks/useBoard";
import useStore from "../hooks/useStore";

import BoardCatalog from "./BoardCatalog";
import BoardHeader from "./BoardHeader";
import ThreadForm, { ThreadFormRef } from "./forms/ThreadForm";

export default function BoardIndex() {
    const threadFormRef = useRef<ThreadFormRef>(null);
    const [formHidden, setFormHidden] = useState(true);
    const board = useBoard();
    const loadPreviews = useStore((state) => state.loadPreviews);
    const boardLoaded = useStore((state) => board && state.loadedBoards.includes(board.id));
    const refreshPreviews = useStore((state) => state.refreshPreviews);

    useEffect(() => {
        if (!board || boardLoaded) return;
        loadPreviews(board);
    }, [board, boardLoaded, loadPreviews]);

    if (!board) return null;

    const openForm = () => {
        setFormHidden(false);
        threadFormRef?.current?.focusTextarea();
    };

    const refreshBoard = () => refreshPreviews(board);

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
                    onClick={() => refreshBoard()}
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

            {!formHidden && <ThreadForm ref={threadFormRef} />}

            <main>
                {boardLoaded ? <BoardCatalog /> : <p>ladataan...</p>}
            </main>
        </>
    );
}
