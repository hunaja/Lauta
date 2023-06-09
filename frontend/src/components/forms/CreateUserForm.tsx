import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { UserAddIcon } from "@heroicons/react/solid";

import { UserForm } from "../../types";
import useStore from "../../hooks/useStore";
import roles, { defaultRole } from "../../roles";

export default function CreateUserForm() {
    const { register, watch, handleSubmit, reset } = useForm();
    const createUser = useStore((state) => state.createUser);

    const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
        createUser({
            ...data,
            role:
                roles.find((r) => r.pretty === data.role)?.name ??
                defaultRole.pretty,
        } as UserForm).then(() => reset());
    };

    return (
        <div className="p-1">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                    {...register("username", { required: true })}
                    type="text"
                    placeholder="Käyttäjännimi"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                />
                <select
                    {...register("role", { required: true })}
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                >
                    {roles
                        .sort((a, b) => a.weight - b.weight)
                        .map((role) => (
                            <option
                                key={role.weight}
                                defaultChecked={role.weight === 1}
                            >
                                {role.pretty}
                            </option>
                        ))}
                </select>
                <input
                    {...register("password", { required: true })}
                    type="password"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Salasana"
                />
                <br />
                <input
                    {...register("passwordAgain", {
                        required: true,
                        validate: (val: string) => watch("password") === val,
                    })}
                    type="password"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Salasana uudelleen"
                />
                <br />

                <div className="flex justify-end mt-1">
                    <button
                        className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2"
                        type="submit"
                    >
                        <UserAddIcon className="inline-block h-3 w-3 mr-1" />
                        Luo
                    </button>
                </div>
            </form>
        </div>
    );
}
