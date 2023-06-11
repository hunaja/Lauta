import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuthStore from "../hooks/useAuthStore";

export default function RequireAuth() {
    const isAuthenticated = useAuthStore((state) => !!state.authorizedUser);

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
