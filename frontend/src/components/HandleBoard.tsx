import React from "react";
import { Outlet, useParams } from "react-router";
import useBoards from "../hooks/useBoards";

export default function HandleBoard() {
    const { boards } = useBoards();
    const { boardPath } = useParams();

    const selectedBoard = boards?.find((board) => board.path === boardPath);

    return <Outlet context={selectedBoard} />;
}
