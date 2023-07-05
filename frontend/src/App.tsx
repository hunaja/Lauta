import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import useAuthStore from "./hooks/useAuthStore";
import useBoards from "./hooks/useBoards";
import useTimeStore from "./hooks/useTimeStore";

import HandleBoard from "./components/HandleBoard";
import BoardIndex from "./components/BoardIndex";
import FrontPage from "./components/FrontPage";
import NotFoundPage from "./components/NotFoundPage";
import ThreadPage from "./components/ThreadPage";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import RequireAuth from "./components/RequireAuth";
import LoadingSpinner from "./components/LoadingSpinner";
import RedirectToPost from "./components/RedirectToPost";
import AllThreads from "./components/AllThreads";

function App() {
    const initializeAuth = useAuthStore((state) => state.initializeAuth);
    const setTime = useTimeStore((state) => state.setTime);

    const { boards } = useBoards();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [setTime]);

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

                    <Route path="/ukko" element={<AllThreads />} />

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
