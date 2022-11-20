import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    XIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/solid";
import { BoardWithoutId, Board } from "../types";
import useStore from "../hooks/useStore";

import BoardForm from "./forms/BoardForm";
import FrontPageLayout from "./FrontPageLayout";
import FrontPageBox from "./FrontPageBox";
import FrontPageBoxHeader from "./FrontPageBoxHeader";

export default function IndexPage() {
    const [editMode, setEditMode] = useState(false);
    const [newBoard, setNewBoard] = useState(false);
    const [editBoard, setEditBoard] = useState<Board | null>(null);
    const boards = useStore((state) => state.boards);
    const loggedIn = useStore((state) => !!state.authorizedUser);
    const createBoard = useStore((state) => state.createBoard);
    const updateBoard = useStore((state) => state.updateBoard);
    const deleteBoard = useStore((state) => state.deleteBoard);
    const latestImages = useStore((state) => state.latestImages);
    const initializeLatestImages = useStore((state) => state.initializeLatestImages);
    const thumbnailPath = useStore((state) => state.imageboardConfig?.thumbnailPath);

    useEffect(() => {
        initializeLatestImages();
    }, [initializeLatestImages]);

    if (!thumbnailPath) return null;

    const handleClose = () => {
        if (editBoard) {
            setEditBoard(null);
            return;
        }

        if (newBoard) {
            setNewBoard(false);
            return;
        }

        setEditMode(!editMode);
    };
    const toggleNewBoard = () => setNewBoard(!newBoard);
    const toggleBoardEdit = (board: Board) => setEditBoard(board);

    const handleNewBoard = async (boardWithoutId: BoardWithoutId) => {
        await createBoard(boardWithoutId);
        setNewBoard(false);
    };

    const handleBoardEdit = async (boardWithoutId: BoardWithoutId) => {
        if (!editBoard) return;

        await updateBoard({
            ...boardWithoutId,
            id: editBoard.id,
        });
        setEditBoard(null);
    };

    const handleBoardDelete = async () => {
        if (!editBoard) return;

        await deleteBoard(editBoard);
        setEditBoard(null);
    };

    return (
        <>
            <Helmet>
                <title>Etusivu</title>
            </Helmet>

            <FrontPageLayout>
                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>Tervetuloa!</h3>
                    </FrontPageBoxHeader>

                    <p>
                        Lauta on suomalainen lautaohjelmisto, joka tarjoilee vierailijoilleen
                        hiotun klassisen käyttäjäkokemuksen vanhan Internetin perinteitä
                        kunnioittaen. Lauta elvyttää Kuvalauta-aikaisen lautakulttuurin miljöön
                        takaisin henkiin modernilla full stack -ratkaisullaan, joka sisältää
                        esimerkiksi MongoDB:n ja Minion.
                    </p>
                </FrontPageBox>

                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>Alalaudat</h3>

                        <div className="text-xs text-purple-400">
                            {editMode && !newBoard && !editBoard && (
                                <button className="underline mr-2 hover:text-purple-500" type="button" onClick={() => toggleNewBoard()}>
                                    <PlusIcon className="inline-block h-3 w-3" />
                                    Lisää
                                </button>
                            )}
                            <button className="underline hover:text-purple-500" type="button" onClick={() => handleClose()}>
                                {loggedIn && (!editMode ? (
                                    <>
                                        <PencilIcon className="inline-block h-3 w-3" />
                                        Muokkaa
                                    </>
                                ) : (
                                    <>
                                        <XIcon className="inline-block h-3 w-3" />
                                        Poistu
                                    </>
                                ))}
                            </button>
                        </div>
                    </FrontPageBoxHeader>

                    {newBoard && (
                        <div className="m-1 p-1 border-2 border-gray-100">
                            <h3 className="text-xl">Luo uusi alalauta</h3>
                            <BoardForm onSubmit={handleNewBoard} buttonText="Luo" />
                        </div>
                    )}

                    {editBoard && (
                        <div className="m-1 p-1 border-2 border-gray-100">
                            <h3 className="text-xl">{`Muokkaa alalautaa ${editBoard.name}`}</h3>
                            <BoardForm oldBoard={editBoard} onSubmit={handleBoardEdit} buttonText="Tallenna" />
                            <h3 className="text-xl">{`Poista alalauta ${editBoard.name}`}</h3>
                            <div className="p-1">
                                <p>
                                    Tämä toiminto poistaa alalaudan
                                    {` ${editBoard.name} `}
                                    peruuttomattomasti. Harkitse vielä kerran.
                                </p>
                                <div className="flex justify-end mt-1">
                                    <button onClick={() => handleBoardDelete()} className="bg-red-500 p-1 pl-2 pr-2 text-white" type="button">
                                        <TrashIcon className="inline-block h-3 w-3 mr-1" />
                                        Poista
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {(boards.length === 0) && (
                        <i>Yhtään alalautaa ei ole vielä luotu.</i>
                    )}

                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        {boards?.map((board) => (
                            <li key={board.id} className="break-words">
                                <Link to={`/${board.path}`}>
                                    {`${board.name} - /${board.path}/`}
                                </Link>

                                {editMode && !newBoard && !editBoard && (
                                    <span className="text-xs text-gray-400">
                                        <br />
                                        {" ["}
                                        <button type="button" className="text-purple-400 hover:text-purple-500" onClick={() => toggleBoardEdit(board)}>
                                            <PencilIcon className="inline-block h-3 w-3" />
                                            Muokkaa
                                        </button>
                                        {" ]"}
                                    </span>
                                )}

                                <br />
                                {board.title}
                            </li>
                        ))}
                    </ul>
                </FrontPageBox>

                <FrontPageBox>
                    <FrontPageBoxHeader>
                        <h3>Uusimmat kuvat</h3>
                    </FrontPageBoxHeader>

                    {!latestImages && <p>Ladataan...</p>}

                    {latestImages && (
                        <ul className="grid grid-cols-5 gap-4">
                            {latestImages.map((image) => (
                                <li key={image.id}>
                                    <Link to={`/post/${image.postNumber}`}>
                                        <img src={`${thumbnailPath}/${image.id}.png`} alt="" />
                                        <span className="text-gray-500 text-xs break-words">{image.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </FrontPageBox>
            </FrontPageLayout>
        </>
    );
}
