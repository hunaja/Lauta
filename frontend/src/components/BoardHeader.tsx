import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, KeyIcon, PuzzleIcon } from "@heroicons/react/solid";

import useBoard from "../hooks/useBoard";
import useAuthStore from "../hooks/useAuthStore";
import useBoards from "../hooks/useBoards";

interface BoardHeaderProps {
    showBoardHeader?: boolean;
}

export default function BoardHeader({ showBoardHeader }: BoardHeaderProps) {
    const currentBoard = useBoard();
    const { boards } = useBoards();
    const authorizedUser = useAuthStore((state) => state.authorizedUser);

    if (!boards) return null;

    return (
        <header>
            <div className="text-gray-400 p-1">
                {" [ "}
                <Link to="/">
                    <HomeIcon className="inline-block h-3 w-3 mr-1" />
                    Etusivu
                </Link>
                {" ]"}

                {" [ "}
                <ul className="inline">
                    {boards.map((board, index) => (
                        <li className="inline" key={board.id}>
                            <Link to={`/${board.path}`} key={board.id}>
                                {`${board.path}`}
                            </Link>
                            {index + 1 < boards.length && " / "}
                        </li>
                    ))}
                </ul>
                {" ] "}

                {" [ "}
                {authorizedUser ? (
                    <Link to="/dashboard">
                        <PuzzleIcon className="inline-block h-3 w-3 mr-1" />
                        {authorizedUser.username}
                    </Link>
                ) : (
                    <Link to="/login">
                        <KeyIcon className="inline-block h-3 w-3 mr-1" />
                        Kirjaudu
                    </Link>
                )}
                {" ] "}
            </div>

            {currentBoard && showBoardHeader && (
                <div className="text-center">
                    <h1 className="text-xl">{currentBoard.name}</h1>
                    <h3 className="text-xl2">{currentBoard.title}</h3>
                </div>
            )}
        </header>
    );
}

BoardHeader.defaultProps = {
    showBoardHeader: true,
};
