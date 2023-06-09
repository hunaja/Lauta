import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import useStore from "../hooks/useStore";
import NotFoundPage from "./NotFoundPage";

export default function RedirectToPost() {
    const [loading, setLoading] = useState(true);
    const loadThreadWithPost = useStore((state) => state.loadThreadWithPost);
    const { postNumber } = useParams();
    const number = Number(postNumber);
    const thread = useStore((state) =>
        state.threads.find((t) => t.posts.map((p) => p.number).includes(number))
    );
    const threadBoardPath = useStore(
        (state) => state.boards.find((b) => b.id === thread?.board)?.path
    );

    useEffect(() => {
        if (!loading) return;

        if (thread) {
            setLoading(false);
            return;
        }

        loadThreadWithPost(number).catch(() => setLoading(false));
    }, [loading, thread, loadThreadWithPost, number]);

    if (loading) return <p>Ladataan...</p>;

    if (!thread || !threadBoardPath) {
        return <NotFoundPage />;
    }

    return (
        <Navigate
            to={`/${threadBoardPath}/${thread.number}#${postNumber}`}
            replace
        />
    );
}
