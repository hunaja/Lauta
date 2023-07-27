import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { PencilIcon } from "@heroicons/react/solid";

import { User, UserForm, UserRole } from "../../types";
import roles from "../../roles";

interface Props {
    id: string;
    defaultUsername: string;
    defaultRole: UserRole;
    editUser: (id: string, user: UserForm) => Promise<User>;
    callback: () => void;
}

export default function EditUserForm({
    id,
    defaultUsername,
    defaultRole,
    editUser,
    callback,
}: Props) {
    const { register, handleSubmit, setFocus } = useForm({
        defaultValues: {
            username: defaultUsername,
            role: defaultRole,
        },
    });

    const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
        editUser(id, data as UserForm).then(() => {
            callback();
        });
    };

    useEffect(() => {
        setFocus("username");
    }, [setFocus]);

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
                    {Object.entries(roles).map(([role, pretty]) => (
                        <option key={role} value={role}>
                            {pretty}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end mt-1">
                    <button
                        className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2"
                        type="submit"
                    >
                        <PencilIcon className="inline-block h-3 w-3 mr-1" />
                        Muokkaa
                    </button>
                </div>
            </form>
        </div>
    );
}
