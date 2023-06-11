import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import useStore from "./hooks/useAuthStore";
import RedirectToPost from "./components/RedirectToPost";
import useBoards from "./hooks/useBoards";

import HandleBoard from "./components/HandleBoard";
import BoardIndex from "./components/BoardIndex";
import FrontPage from "./components/FrontPage";
import NotFoundPage from "./components/NotFoundPage";
import ThreadPage from "./components/ThreadPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
    const initializeAuth = useStore((state) => state.initializeAuth);

    const { boards } = useBoards();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    if (!boards) {
        return (
            <div className="h-screen w-screen flex-col flex">
                <LoadingSpinner />
            </div>
        );
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

                    <Route
                        path="/post/:postNumber"
                        element={<RedirectToPost />}
                    />

                    <Route path="/:boardPath" element={<HandleBoard />}>
                        <Route index element={<BoardIndex />} />
                        <Route
                            path="/:boardPath/:threadNumber"
                            element={<ThreadPage />}
                        />
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;
