import { useCallback } from "react";
import useSWR from "swr";

import { Board, ThreadForm } from "../types";
import threadsService from "../services/threadsService";

export default function useCatalog(board?: Board) {
    const { data, mutate, error, isValidating } = useSWR(
        board ? `/api/boards/${board.id}/threads` : null,
        board ? async () => threadsService.getPreviews(board) : null,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    const update = useCallback(() => {
        mutate();
    }, [mutate]);

    const create = useCallback(
        async (form: ThreadForm) => {
            if (!board) {
                throw new Error("Board is not defined");
            }

            const createdThread = await threadsService.create(board, form);
            mutate(
                (threads) =>
                    threads ? [createdThread, ...threads] : [createdThread],
                false
            );

            return createdThread;
        },
        [board, mutate]
    );

    return { threads: data, update, create, error, validating: isValidating };
}
