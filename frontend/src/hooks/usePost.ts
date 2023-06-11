import useSWR from "swr";
import threadsService from "../services/threadsService";

export default function usePost(postNumber?: number) {
    const { data, isLoading } = useSWR(
        postNumber && postNumber > 0 ? `/api/posts/number/${postNumber}` : null,
        postNumber
            ? async () => threadsService.getPostByNumber(postNumber)
            : null
    );

    return { post: data, loading: isLoading };
}
