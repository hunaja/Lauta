import React from "react";
import usePost from "../hooks/usePost";
import PostBoxFloating from "./PostBoxFloating";

interface Props {
    postNumber: number;
}

export default function PostBoxFloatingFromId({ postNumber }: Props) {
    const { post } = usePost(postNumber);

    if (!post)
        return (
            <p>
                <i>Viestiä ei löytynyt.</i>
            </p>
        );

    return <PostBoxFloating thread={post?.thread} post={post} />;
}
