import React from "react";
import usePost from "../../use_post";
import PostBoxFloating from "./box_floating";
import LoadingSpinner from "../../spinner";

interface Props {
    postNumber: number;
}

export default function PostBoxFloatingFromId({ postNumber }: Props) {
    const { post, loading } = usePost(postNumber);

    if (!post) {
        if (loading) return <LoadingSpinner />;

        return (
            <p>
                <i>Viestiä ei löytynyt.</i>
            </p>
        );
    }
    return <PostBoxFloating thread={post?.thread} post={post} />;
}
