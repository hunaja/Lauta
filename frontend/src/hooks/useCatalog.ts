import useSWR from "swr";

import { Board, ThreadForm } from "../types";
import threadsService from "../services/threadsService";

export default function useCatalog(board?: Board) {
    const { data, mutate } = useSWR(
        board ? `/api/boards/${board.id}/threads` : null,
        board ? async () => threadsService.getPreviews(board) : null,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    const create = async (form: ThreadForm) => {
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
    };

    return { threads: data, create };
}
