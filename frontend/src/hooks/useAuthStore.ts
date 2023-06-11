import create from "zustand";

import { AuthStore, LoginForm } from "../types";
import authService from "../services/authService";
import usersService from "../services/usersService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default create<AuthStore>((set, get) => ({
    authorizedUser: null,
    initializeAuth: () => {
        const jsonUser = window.localStorage.getItem("authorizedUser");
        if (!jsonUser) return;
        set({ authorizedUser: JSON.parse(jsonUser) });
    },
    login: async (loginForm: LoginForm) => {
        const authorizedUser = await authService.authorize(loginForm);
        window.localStorage.setItem(
            "authorizedUser",
            JSON.stringify(authorizedUser)
        );
        set(() => ({ authorizedUser }));
    },
    logout: () => {
        window.localStorage.removeItem("authorizedUser");

        set({
            authorizedUser: null,
        });
    },
    changePassword: async (oldPassword: string, newPassword: string) => {
        const { authorizedUser } = get();
        if (!authorizedUser) {
            throw new Error("User is not logged in");
        }

        await usersService.changePassword(
            authorizedUser.token,
            authorizedUser.id,
            oldPassword,
            newPassword
        );
    },
}));
