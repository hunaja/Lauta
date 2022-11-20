import React from "react";
import { Outlet, useParams } from "react-router";
import useStore from "../hooks/useStore";

import NotFoundPage from "./NotFoundPage";

export default function HandleBoard() {
    const boards = useStore((state) => state.boards);
    const { boardPath } = useParams();

    const selectedBoard = boards?.find((board) => board.path === boardPath);
    if (!selectedBoard) return <NotFoundPage />;

    return <Outlet context={selectedBoard} />;
}
