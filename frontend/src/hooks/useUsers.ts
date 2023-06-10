import { useCallback } from "react";
import useSWR from "swr";
import usersService from "../services/usersService";
import { UserForm } from "../types";
import useStore from "./useStore";

export default function useUsers() {
    const token = useStore((state) => state.authorizedUser?.token);

    const { data, mutate } = useSWR(
        token ? "/api/users" : null,
        token ? async () => usersService.getAllUsers(token) : null
    );

    const create = useCallback(
        async (form: UserForm) => {
            if (!token) {
                throw new Error("User is not logged in");
            }

            const createdUser = await usersService.createUser(token, form);
            mutate((users = []) => [...users, createdUser], false);
            return createdUser;
        },
        [mutate, token]
    );

    const update = useCallback(
        async (userId: string, form: UserForm) => {
            if (!token) {
                throw new Error("User is not logged in");
            }

            const updatedUser = await usersService.editUser(
                token,
                userId,
                form
            );
            mutate(
                (users = []) =>
                    users.map((u) =>
                        u.id === updatedUser.id ? updatedUser : u
                    ),
                false
            );
            return updatedUser;
        },
        [mutate, token]
    );

    return {
        users: data,
        create,
        update,
    };
}
