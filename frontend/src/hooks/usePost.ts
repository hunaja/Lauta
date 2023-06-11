import useSWR from "swr";
import threadsService from "../services/threadsService";

export default function usePost(postNumber?: number) {
    const { data, isLoading } = useSWR(
        postNumber && postNumber > 1 ? `/api/posts/${postNumber}` : null,
        postNumber
            ? async () => threadsService.getPostByNumber(postNumber)
            : null
    );

    return { post: data, loading: isLoading };
}
