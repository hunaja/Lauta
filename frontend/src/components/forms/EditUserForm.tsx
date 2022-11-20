import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { PencilIcon } from "@heroicons/react/solid";

import { UserForm } from "../../types";
import useStore from "../../hooks/useStore";
import roles, { defaultRole as imageboardDefaultRole } from "../../roles";

// TODO: Refactor these
interface EditUserFormProps {
    id: string;
    defaultUsername: string;
    defaultRole: string;
}

export default function EditUserForm({ id, defaultUsername, defaultRole }: EditUserFormProps) {
    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            username: defaultUsername,
            role: roles.find((r) => r.name === defaultRole)?.pretty,
        },
    });
    const editUser = useStore((state) => state.editUser);

    const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
        editUser(id, {
            ...data,
            role: roles.find((r) => r.pretty === data.role)?.name ?? imageboardDefaultRole.name,
        } as UserForm);
    };

    return (
        <div className="p-1">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input {...register("username", { required: true })} type="text" placeholder="Käyttäjännimi" className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1" />
                <select {...register("role", { required: true })} className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1">
                    {roles
                        .sort((a, b) => a.weight - b.weight)
                        .map((role) => (
                            <option
                                key={role.weight}
                                defaultChecked={role.weight === imageboardDefaultRole.weight}
                            >
                                {role.pretty}
                            </option>
                        ))}
                </select>

                <div className="flex justify-end mt-1">
                    <button className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2" type="submit">
                        <PencilIcon className="inline-block h-3 w-3 mr-1" />
                        Muokkaa
                    </button>
                </div>
            </form>
        </div>
    );
}
