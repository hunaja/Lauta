import React from "react";

interface FrontPageBoxHeaderProps {
    children: React.ReactElement | React.ReactElement[]
}

export default function FrontPageBoxHeader({ children }: FrontPageBoxHeaderProps) {
    return (
        <div className="bg-purple-200 flex justify-between items-center pl-0.5 pr-0.5 text-lg">
            {children}
        </div>
    );
}
