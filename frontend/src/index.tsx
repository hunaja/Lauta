import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import FrontPage from "./front";
import NotFoundPage from "./front/not_found";
import LoginPage from "./front/login";
import RequireAuth from "./front/dashboard/layout";
import DashboardPage from "./front/dashboard";
import HandleBoard from "./board/layout";
import BoardIndex from "./board";
import AllThreads from "./ukko";
import RedirectToPost from "./redirect_to_post";
import BoardCatalog from "./board/catalog";
import ThreadPage from "./board/thread";

const router = createBrowserRouter([
    {
        path: "/",
        element: <FrontPage />,
    },
    {
        path: "/*",
        element: <NotFoundPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: <RequireAuth />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />,
            },
        ],
    },
    {
        path: "/:boardPath",
        element: <HandleBoard />,
        children: [
            {
                path: "/:boardPath",
                element: <BoardIndex />,
            },
            {
                path: "/:boardPath/:threadNumber",
                element: <ThreadPage />,
            },
            {
                path: "/:boardPath/catalog",
                element: <BoardCatalog />,
            },
        ],
    },
    {
        path: "/ukko",
        element: <AllThreads />,
    },
    {
        path: "/post/:postNumber",
        element: <RedirectToPost />,
    },
]);

ReactDOM.render(
    <RouterProvider router={router} />,
    document.getElementById("root")
);
