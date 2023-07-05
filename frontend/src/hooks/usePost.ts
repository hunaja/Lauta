import useSWR from "swr";
import postsService from "../services/postsService";

export default function usePost(postNumber?: number) {
    const { data, isLoading } = useSWR(
        postNumber && postNumber > 0 ? `/api/posts/number/${postNumber}` : null,
        postNumber ? async () => postsService.getPostByNumber(postNumber) : null
    );

    return { post: data, loading: isLoading };
}
