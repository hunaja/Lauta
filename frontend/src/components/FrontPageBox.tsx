import React from "react";

interface FrontPageBox {
    children: (React.ReactElement | string | boolean | number | null)[]
}

export default function FrontPageBox({ children }: FrontPageBox) {
    const [titleBar, ...others] = children;

    return (
        <div className="border-2 border-purple-200 m-2 bg-white">
            {titleBar}
            <div className="p-1">
                {others}
            </div>
        </div>
    );
}
