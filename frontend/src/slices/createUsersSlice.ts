import { StoreSlice } from "../hooks/useStore";
import {
    AuthSlice,
    UserForm,
    UsersSlice,
} from "../types";
import usersService from "../services/usersService";

const createUsersSlice: StoreSlice<UsersSlice, AuthSlice> = (set, get) => ({
    users: [],
    initializeUsers: async () => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        const users = await usersService.getAllUsers(token);

        set({ users });
    },
    createUser: async (userForm: UserForm) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        const user = await usersService.createUser(token, userForm);
        set({ users: [...get().users, user] });
    },
    changePassword: async (oldPassword: string, newPassword: string) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token, id } = authorizedUser;

        await usersService.changePassword(token, id, oldPassword, newPassword);
    },
    editUser: async (userId: string, userForm: UserForm) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        await usersService.editUser(token, userId, userForm);
    },
    deleteUser: async (userId: string) => {
        const { authorizedUser } = get();
        if (!authorizedUser) throw new Error("Unauthorized");
        const { token } = authorizedUser;

        await usersService.deleteUser(token, userId);
    },
});

export default createUsersSlice;
