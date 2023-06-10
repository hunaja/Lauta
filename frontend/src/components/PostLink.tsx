import React from "react";
import { Link } from "react-router-dom";

type Props = {
    postNumber: number;
};

export default function PostLink({ postNumber }: Props) {
    return <Link to={`/post/${postNumber}`}>{`>>${postNumber}`}</Link>;

    /*    const onClick = (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        if (Number(currentThreadNumberStr) === thread?.number) {
            event.preventDefault();
        }
    };

    return (
        <>
            <Link
                to={`/post/${post.number}`}
                onMouseOver={() => setPreviewOpen(true)}
                onMouseLeave={() => setPreviewOpen(false)}
                onClick={(event) => onClick(event)}
            >
                {`>>${post.number}`}
            </Link>
            {previewOpen && (
                <div className="absolute left-0 sm:left-auto z-10 overflow-hidden border-2 border-purple-400 bg-white p-1 w-full sm:w-auto sm:max-w-[96%] break-words whitespace-pre-line">
                    {post && <PostBoxBody post={post} thread={thread} />}
                </div>
            )}
        </>
    ); */
}
