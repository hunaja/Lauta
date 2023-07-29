import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";

import { Post, Thread, UserRole } from "../../types";
import useAuthStore from "../../use_auth";

export interface Props {
    thread: Thread;
    post?: Post;
    deleteThread?: (thread: Thread) => Promise<void>;
    deletePost?: (post: Post) => Promise<void>;
    deleteFile?: (post: Post) => Promise<void>;
}

export default function PopupButton({
    thread,
    post,
    deleteThread,
    deletePost,
    deleteFile,
}: Props) {
    const [popupOpen, setPopupOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const isAdmin = useAuthStore(
        (state) => state.authorizedUser?.role === UserRole.ADMIN
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setPopupOpen]);

    return (
        <>
            <button
                type="button"
                className="text-indigo-500 hover:text-indigo-700 hover:underline"
                onClick={() => !popupOpen && setPopupOpen(true)}
            >
                {!popupOpen ? (
                    <ChevronDownIcon className="inline-block h-4 w-4 ml-1" />
                ) : (
                    <ChevronRightIcon className="text-indigo-700 inline-block h-4 w-4 ml-1" />
                )}
            </button>

            {popupOpen && (
                <div
                    className="absolute inline-block z-10 border-2 text-xs border-purple-400 bg-white"
                    ref={popupRef}
                >
                    <ul className="text-indigo-700">
                        <li>
                            <button
                                type="button"
                                className="p-1 w-full hover:text-indigo-500 hover:bg-gray-200"
                            >
                                Vinkkaa
                            </button>
                        </li>

                        {isAdmin && (
                            <>
                                {(!post || thread.id === post.id) && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                deleteThread?.(thread);
                                                setPopupOpen(false);
                                            }}
                                            type="button"
                                            className="p-1 w-full hover:text-indigo-500 hover:bg-gray-200 border-t-2 border-purple-400"
                                        >
                                            Poista lanka
                                        </button>
                                    </li>
                                )}

                                {post && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                deletePost?.(post);
                                                setPopupOpen(false);
                                            }}
                                            type="button"
                                            className="p-1 w-full hover:text-indigo-500 hover:bg-gray-200 border-t-2 border-purple-400"
                                        >
                                            Poista viesti
                                        </button>
                                    </li>
                                )}

                                {post?.file && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                deleteFile?.(post);
                                                setPopupOpen(false);
                                            }}
                                            type="button"
                                            className="p-1 w-full hover:text-indigo-500 hover:bg-gray-200 border-t-2 border-purple-400"
                                        >
                                            Poista kuva
                                        </button>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
}

PopupButton.defaultProps = {
    deleteThread: undefined,
    deletePost: undefined,
    deleteFile: undefined,
    post: undefined,
};
