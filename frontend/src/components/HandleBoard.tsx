import React from "react";
import { Outlet, useParams } from "react-router";
import useBoards from "../hooks/useBoards";
import NotFoundPage from "./NotFoundPage";

export default function HandleBoard() {
    const { boards, error } = useBoards();
    const { boardPath } = useParams();

    const selectedBoard = boards?.find((board) => board.path === boardPath);

    if (error || (boards && !selectedBoard)) {
        return <NotFoundPage />;
    }

    return <Outlet context={selectedBoard} />;
}
