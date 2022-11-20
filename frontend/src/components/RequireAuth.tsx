import React from "react";
import { Navigate, Outlet } from "react-router";
import useStore from "../hooks/useStore";

export default function RequireAuth() {
    const isAuthenticated = useStore((state) => !!state.authorizedUser);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
