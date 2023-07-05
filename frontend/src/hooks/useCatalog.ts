import { useCallback } from "react";
import useSWR from "swr";

import { Board, ThreadForm } from "../types";
import boardsService from "../services/boardsService";

export default function useCatalog(board?: Board, page = 1) {
    const { data, mutate, error } = useSWR(
        board ? `/api/boards/${board.id}/threads?page=${page}` : null,
        board ? async () => boardsService.getPreviews(board, page) : null
    );

    const create = useCallback(
        async (form: ThreadForm) => {
            if (!board) {
                throw new Error("Board is not defined");
            }

            const createdThread = await boardsService.createThread(board, form);
            mutate(
                (threads) =>
                    threads ? [createdThread, ...threads] : [createdThread],
                false
            );

            return createdThread;
        },
        [board, mutate]
    );

    return { threads: data, create, error };
}
