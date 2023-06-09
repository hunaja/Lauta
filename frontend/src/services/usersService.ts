import axios from "axios";
import { User, UserForm } from "../types";

const baseUrl = "/api/users";

const getAllUsers = async (jwtToken: string): Promise<Array<User>> => {
    const response = await axios.get(baseUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
    });

    return response.data;
};

const createUser = async (
    jwtToken: string,
    userForm: UserForm
): Promise<User> => {
    const response = await axios.post(baseUrl, userForm, {
        headers: { Authorization: `Bearer ${jwtToken}` },
    });

    return response.data;
};

const editUser = async (
    jwtToken: string,
    userId: string,
    userForm: UserForm
) => {
    const response = await axios.put(`${baseUrl}/${userId}`, userForm, {
        headers: { Authorization: `Bearer ${jwtToken}` },
    });

    return response.data;
};

const changePassword = async (
    jwtToken: string,
    userId: string,
    oldPassword: string,
    newPassword: string
): Promise<void> => {
    const response = await axios.post(
        `${baseUrl}/${userId}/password`,
        { oldPassword, newPassword },
        {
            headers: { Authorization: `Bearer ${jwtToken}` },
        }
    );

    return response.data;
};

const deleteUser = async (jwtToken: string, userId: string) => {
    const response = await axios.delete(`${baseUrl}/${userId}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
    });

    return response.data;
};

const actions = {
    getAllUsers,
    createUser,
    editUser,
    changePassword,
    deleteUser,
};

export default actions;
