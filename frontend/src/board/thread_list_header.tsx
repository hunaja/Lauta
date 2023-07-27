import React, { useRef, useState } from "react";
import { PlusIcon, SelectorIcon, ViewListIcon } from "@heroicons/react/solid";
import { Link, useSearchParams } from "react-router-dom";
import ThreadForm, { Ref as ThreadFormRef } from "./form";
import { Board, Thread, ThreadForm as ThreadFormType } from "../types";

export default function ThreadListHeader({
    board,
    createThread,
    currentMode = "default",
}: {
    board: Board;
    createThread: (thread: ThreadFormType) => Promise<Thread>;
    currentMode?: "catalog" | "default";
}) {
    const threadFormRef = useRef<ThreadFormRef>(null);
    const [formHidden, setFormHidden] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const openForm = () => {
        setFormHidden(false);
        threadFormRef?.current?.focusTextarea();
    };

    const handlePageChange = (pageId: number) => {
        const params = new URLSearchParams(searchParams);
        if (pageId > 1) {
            params.set("page", pageId.toString());
        } else {
            params.delete("page");
        }

        setSearchParams(params);
    };

    return (
        <>
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
                    {currentMode === "default" ? (
                        <Link
                            to={`/${board.path}/catalog`}
                            className="text-indigo-500 hover:text-indigo-700 hover:underline"
                            type="button"
                        >
                            <SelectorIcon className="inline-block h-3 w-3 mr-1" />
                            Katalogi
                        </Link>
                    ) : (
                        <Link
                            to={`/${board.path}`}
                            className="text-indigo-500 hover:text-indigo-700 hover:underline"
                            type="button"
                        >
                            <ViewListIcon className="inline-block h-3 w-3 mr-1" />
                            Perusnäkymä
                        </Link>
                    )}
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
        </>
    );
}

ThreadListHeader.defaultProps = {
    currentMode: "default",
};
