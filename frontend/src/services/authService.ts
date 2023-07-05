import axios from "axios";
import { AuthorizedUser, LoginForm, User } from "../types";

const authorize = async (loginForm: LoginForm): Promise<AuthorizedUser> => {
    const response = await axios.post("/api/authorize", loginForm);
    return response.data;
};

const editUser = async (
    jwtToken: string,
    user: User & { password?: string }
) => {
    const userForm = {
        username: user.username,
        role: user.username,
        password: user.password,
    };

    const response = await axios.put<User>(`/api/users/${user.id}`, userForm, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });

    return response.data;
};

const actions = {
    authorize,
    editUser,
};

export default actions;
