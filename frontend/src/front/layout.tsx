import React from "react";

import BoardHeader from "../header";
import logo from "./logo.png";

interface FrontPageLayoutProperties {
    children: any;
}

export default function FrontPageLayout({
    children,
}: FrontPageLayoutProperties) {
    return (
        <>
            <BoardHeader showBoardHeader={false}>
                <img
                    src={logo}
                    className="mx-auto mt-8 h-48 w-96 text-center"
                    alt="Lauta Logo"
                />
            </BoardHeader>

            <div className="mx-auto sm:w-screen md:w-4/6 lg:6/12 xl:w-2/4 my-10">
                {children}
            </div>
        </>
    );
}
