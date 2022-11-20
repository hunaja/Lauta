import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import useStore from "./hooks/useStore";

import HandleBoard from "./components/HandleBoard";
import BoardIndex from "./components/BoardIndex";
import FrontPage from "./components/FrontPage";
import NotFoundPage from "./components/NotFoundPage";
import ThreadPage from "./components/ThreadPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import RedirectToPost from "./components/RedirectToPost";

function App() {
    const [boardsLoading, setBoardsLoading] = useState(true);
    const [imageboardDataLoading, setImageboardDataLoading] = useState(true);
    const initializeAuth = useStore((state) => state.initializeAuth);
    const initializeImageboard = useStore((state) => state.initializeImageboard);
    const initializeBoards = useStore((state) => state.initializeBoards);

    useEffect(() => {
        initializeImageboard()
            .catch(() => setImageboardDataLoading(true))
            .then(() => setImageboardDataLoading(false));
    }, [initializeImageboard, setImageboardDataLoading]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        initializeBoards()
            .then(() => setBoardsLoading(false));
    }, [initializeBoards, setBoardsLoading]);

    if (boardsLoading || imageboardDataLoading) {
        return null;
    }

    return (
        <>
            <Helmet titleTemplate="%s - Lauta" />

            <Router>
                <Routes>
                    <Route index element={<FrontPage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/dashboard" element={<RequireAuth />}>
                        <Route index element={<DashboardPage />} />
                    </Route>

                    <Route path="/post/:postNumber" element={<RedirectToPost />} />

                    <Route path="/:boardPath" element={<HandleBoard />}>
                        <Route index element={<BoardIndex />} />
                        <Route path="/:boardPath/:threadNumber" element={<ThreadPage />} />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
