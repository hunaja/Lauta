import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useStore from "../hooks/useStore";
import PostBoxBody from "./PostBoxBody";

export interface PostLinkProps {
    postNumber: number;
}

export default function PostLink({ postNumber }: PostLinkProps) {
    const { threadNumber: currentThreadNumberStr } = useParams(); // Available on thread
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const postThread = useStore((state) => (previewOpen || undefined)
        && state.threads
            .find((t) => t.posts.map((p) => p.number).includes(postNumber)));
    const post = postThread?.posts.find((p) => p.number === postNumber);
    const loadThreadWithPost = useStore((state) => state.loadThreadWithPost);

    const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (Number(currentThreadNumberStr) === postThread?.number) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        if (!previewOpen || !loading) return;

        if (post) {
            setLoading(false);
            return;
        }

        loadThreadWithPost(postNumber)
            .catch(() => setLoading(false));
    }, [previewOpen, post, loadThreadWithPost, postNumber, loading]);

    return (
        <>
            <Link
                to={`/post/${postNumber}`}
                onMouseOver={() => setPreviewOpen(true)}
                onMouseLeave={() => setPreviewOpen(false)}
                onClick={(event) => onClick(event)}
            >
                {`>>${postNumber}`}
            </Link>
            {previewOpen && (
                <div className="absolute left-0 sm:left-auto z-10 overflow-hidden border-2 border-purple-400 bg-white p-1 w-full sm:w-auto sm:max-w-[96%] break-words whitespace-pre-line">
                    {loading && <span className="text-gray-500">Ladataan viestiä...</span>}

                    {!loading && !post && <span className="text-gray-500">Viestiä ei löydy.</span>}

                    {(postThread && post) && (
                        <PostBoxBody
                            post={post}
                            thread={postThread}
                        />
                    )}
                </div>
            )}
        </>
    );
}
