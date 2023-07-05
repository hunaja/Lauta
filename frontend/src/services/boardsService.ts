import axios from "axios";
import { Board, BoardWithoutId, CatalogThread, ThreadForm } from "../types";

const baseUrl = "/api/boards";
const threadsBaseUrl = (board: Board) => `/api/boards/${board.id}/threads`;

const getAll = async (): Promise<Board[]> => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const create = async (token: string, board: BoardWithoutId) => {
    const response = await axios.post<Board>(baseUrl, board, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const update = async (token: string, board: Board) => {
    const response = await axios.put<Board>(`${baseUrl}/${board.id}`, board, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const remove = async (token: string, board: Board) => {
    await axios.delete(`${baseUrl}/${board.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const getPreviews = async (board: Board, page = 0) => {
    const response = await axios.get<CatalogThread[]>(threadsBaseUrl(board), {
        params: { page },
    });
    return response.data;
};

const createThread = async (board: Board, threadForm: ThreadForm) => {
    const formData = new FormData();
    formData.append("title", threadForm.title);
    formData.append("text", threadForm.post.text);
    formData.append("email", threadForm.post.email);
    formData.append("author", threadForm.post.author);
    if (threadForm.post.file) formData.append("file", threadForm.post.file);

    const response = await axios.post<CatalogThread>(
        threadsBaseUrl(board),
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

const boardsService = {
    getAll,
    create,
    update,
    remove,
    getPreviews,
    createThread,
};

export default boardsService;
