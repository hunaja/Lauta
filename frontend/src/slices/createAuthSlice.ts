import { StoreSlice } from "../hooks/useStore";
import { LoginForm, AuthSlice } from "../types";
import usersService from "../services/authService";

const createAuthSlice: StoreSlice<AuthSlice> = (set) => ({
    authorizedUser: null,
    initializeAuth: () => {
        const jsonUser = window.localStorage.getItem("authorizedUser");
        if (!jsonUser) return;
        set({ authorizedUser: JSON.parse(jsonUser) });
    },
    login: async (loginForm: LoginForm) => {
        const authorizedUser = await usersService.authorize(loginForm);
        window.localStorage.setItem("authorizedUser", JSON.stringify(authorizedUser));
        set(() => ({ authorizedUser }));
    },
    logout: () => {
        window.localStorage.removeItem("authorizedUser");

        set({
            authorizedUser: null,
        });
    },
});

export default createAuthSlice;
