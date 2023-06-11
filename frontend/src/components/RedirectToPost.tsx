import React from "react";
import { Navigate, useParams } from "react-router-dom";

import NotFoundPage from "./NotFoundPage";
import usePost from "../hooks/usePost";
import useBoards from "../hooks/useBoards";
import LoadingSpinner from "./LoadingSpinner";

export default function RedirectToPost() {
    const { postNumber: postNumberStr } = useParams();
    const postNumber = Number(postNumberStr);

    const { post, loading } = usePost(postNumber);
    const { boards } = useBoards();

    if (!boards) return null;

    if (loading) {
        return (
            <div className="h-screen w-screen flex-col flex">
                <LoadingSpinner />
            </div>
        );
    }

    const board = boards.find((b) => b.id === post?.thread.board);

    return board && post ? (
        <Navigate
            to={`/${board?.path}/${post.thread.number}#${post.number}`}
            replace
        />
    ) : (
        <NotFoundPage />
    );
}
