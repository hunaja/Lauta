import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, KeyIcon, PuzzleIcon } from "@heroicons/react/solid";

import useBoard from "./board/use_board";
import useAuthStore from "./use_auth";
import useBoards from "./use_boards";

interface BoardHeaderProps {
    children?: any;
    showBoardHeader?: boolean;
}

export default function BoardHeader({
    children,
    showBoardHeader,
}: BoardHeaderProps) {
    const currentBoard = useBoard();
    const { boards } = useBoards();
    const authorizedUser = useAuthStore((state) => state.authorizedUser);

    if (!boards) return null;

    return (
        <header className="bg-gradient-to-b from-red-200 to-rose-50">
            <div className="text-gray-400 px-3 pt-2 flex">
                <span>
                    {" [ "}
                    <Link to="/">
                        <HomeIcon className="inline-block h-3 w-3 mr-1" />
                        Etusivu
                    </Link>
                    {" ]"}
                </span>

                <nav className="mx-2">
                    {" [ "}
                    <ul className="inline">
                        <li className="inline">
                            <Link to="/ukko">ukko</Link>
                        </li>

                        {boards.length ? " / " : ""}

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
                </nav>

                <span>
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
                </span>
            </div>

            {children}

            {currentBoard && showBoardHeader && (
                <div className="text-center py-5">
                    <h1 className="text-xl">{currentBoard.name}</h1>
                    <h3 className="text-xl2">{currentBoard.title}</h3>
                </div>
            )}
        </header>
    );
}

BoardHeader.defaultProps = {
    showBoardHeader: true,
    children: null,
};
