import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
    postNumber: number;
    postBox?: (postNumber: number) => JSX.Element;
    onClick?: (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        postNumber: number
    ) => void;
};

export default function PostLink({ postNumber, postBox, onClick }: Props) {
    const [previewOpen, setPreviewOpen] = useState(false);

    return (
        <>
            {postBox ? (
                <Link
                    to={`/post/${postNumber}`}
                    onMouseOver={() => setPreviewOpen(true)}
                    onMouseLeave={() => setPreviewOpen(false)}
                    onClick={(event) => onClick?.(event, postNumber)}
                >
                    {`>>${postNumber}`}
                </Link>
            ) : (
                <span className="text-indigo-500">{`>>${postNumber}`}</span>
            )}
            {postBox && previewOpen && (
                <div className="absolute left-0 sm:left-auto z-10 overflow-hidden border-2 border-purple-400 bg-white p-1 w-full sm:w-auto sm:max-w-[96%] break-words whitespace-pre-line">
                    {postBox(postNumber)}
                </div>
            )}
        </>
    );
}

PostLink.defaultProps = {
    postBox: undefined,
    onClick: undefined,
};
