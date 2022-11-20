import boardsService from "../services/boardsService";
import {
    Board,
    BoardWithoutId,
    BoardsSlice,
    AuthSlice,
} from "../types";
import { StoreSlice } from "../hooks/useStore";

const createBoardsSlice: StoreSlice<BoardsSlice, AuthSlice> = (set, get) => ({
    boards: [],
    initializeBoards: async () => {
        const boards = await boardsService.getAll();
        set({ boards });
    },
    createBoard: async (boardWithoutId: BoardWithoutId) => {
        const token = get().authorizedUser?.token;
        if (!token) throw new Error("Unauthorized");

        const board = await boardsService.create(token, boardWithoutId);

        set((state) => ({ boards: [...state.boards, board] }));
    },
    updateBoard: async (board: Board) => {
        const token = get().authorizedUser?.token;
        if (!token) throw new Error("Unauthorized");

        const updatedBoard = await boardsService.update(token, board);

        set((state) => ({
            boards: [...state.boards.filter((b) => b.id !== updatedBoard.id), updatedBoard],
        }));
    },
    deleteBoard: async (board: Board) => {
        const token = get().authorizedUser?.token;
        if (!token) throw new Error("Unauthorized");

        await boardsService.remove(token, board);

        set((state) => ({ boards: state.boards.filter((b) => b.id !== board.id) }));
    },
});

export default createBoardsSlice;
