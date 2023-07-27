import { useCallback } from "react";
import useSWRImmutable from "swr/immutable";

import boardsService from "./services/boardsService";
import { Board, BoardWithoutId } from "./types";
import useStore from "./use_auth";

export default function useBoards() {
    const token = useStore((state) => state.authorizedUser?.token);
    const { data, mutate, error } = useSWRImmutable(
        "/api/boards",
        boardsService.getAll
    );

    const create = useCallback(
        async (board: BoardWithoutId): Promise<Board> => {
            if (!token) throw new Error("Unauthorized");

            const newBoard = await boardsService.create(token, board);
            mutate((boards) => [...(boards ?? []), newBoard], false);
            return newBoard;
        },
        [mutate, token]
    );

    const update = useCallback(
        async (board: Board): Promise<Board> => {
            if (!token) throw new Error("Unauthorized");

            const updatedBoard = await boardsService.update(token, board);

            mutate(
                (boards) => [
                    ...(boards ?? []).filter((b) => b.id !== board.id),
                    updatedBoard,
                ],
                false
            );

            return updatedBoard;
        },
        [mutate, token]
    );

    const remove = useCallback(
        async (board: Board): Promise<void> => {
            if (!token) throw new Error("Unauthorized");

            await boardsService.remove(token, board);

            mutate(
                (boards) => [
                    ...(boards ?? []).filter((b) => b.id !== board.id),
                ],
                false
            );
        },
        [mutate, token]
    );

    return { boards: data, create, update, remove, error };
}
