import useSWR from "swr";
import threadsService from "../services/threadsService";

export default function useAllCatalog(page: number) {
    const { data, error } = useSWR(
        page ? `/api/threads?page=${page}` : null,
        threadsService.getAll
    );

    return { threads: data, error };
}
