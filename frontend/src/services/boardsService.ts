import axios from "axios";
import { Board, BoardWithoutId } from "../types";

const baseUrl = "/api/boards";

const getAll = async (): Promise<Board[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const create = async (token: string, board: BoardWithoutId): Promise<Board> => {
    const response = await axios.post(baseUrl, board, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const update = async (token: string, board: Board): Promise<Board> => {
    const response = await axios.put(`${baseUrl}/${board.id}`, board, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const remove = async (token: string, board: Board): Promise<void> => {
    await axios.delete(`${baseUrl}/${board.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const actions = {
    getAll,
    create,
    update,
    remove,
};

export default actions;
