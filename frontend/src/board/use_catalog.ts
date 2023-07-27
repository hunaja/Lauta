import { useCallback } from "react";
import useSWR from "swr";

import { Board, ThreadForm } from "../types";
import boardsService from "../services/boardsService";

export default function useCatalog(
    board?: Board,
    page = 1,
    mode: "catalog" | "default" = "default"
) {
    const { data, mutate, error } = useSWR(
        board
            ? `/api/boards/${board.id}/threads?page=${page}&mode=${mode}`
            : null,
        board ? async () => boardsService.getPreviews(board, page) : null,
        {
            revalidateIfStale: mode === "catalog",
            revalidateOnFocus: mode === "catalog",
            revalidateOnReconnect: mode === "catalog",
        }
    );

    const create = useCallback(
        async (form: ThreadForm) => {
            if (!board) {
                throw new Error("Board is not defined");
            }

            const createdThread = await boardsService.createThread(board, form);
            mutate((threads = []) => [createdThread, ...threads], false);

            return createdThread;
        },
        [board, mutate]
    );

    return { threads: data, create, error };
}
