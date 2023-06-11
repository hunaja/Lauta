import React from "react";
import usePost from "../hooks/usePost";
import PostBoxFloating from "./PostBoxFloating";
import LoadingSpinner from "./LoadingSpinner";

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
