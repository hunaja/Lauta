import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { PencilIcon } from "@heroicons/react/solid";

export interface Props {
    callback: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordForm({
    callback,
    changePassword,
}: Props) {
    const {
        register,
        getValues,
        handleSubmit,
        setError,
        setFocus,
        formState: { errors },
    } = useForm();

    const handleFormSubmit: SubmitHandler<FieldValues> = ({
        newPassword,
        oldPassword,
    }) => {
        changePassword(oldPassword, newPassword)
            .then(() => {
                callback();
            })
            .catch((e) => {
                setError(
                    e.response?.data.field ?? "oldPassword",
                    {
                        type: "api",
                        message:
                            e.response?.data.error ??
                            "Salasanaa ei voitu vaihtaa tuntemattomasta syystä.",
                    },
                    { shouldFocus: true }
                );
            });
    };

    useEffect(() => {
        setFocus("oldPassword");
    }, [setFocus]);

    return (
        <div className="p-1">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                    {...register("oldPassword", { required: true })}
                    type="password"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Vanha salasana"
                />
                {errors.oldPassword?.type === "api" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        {errors.oldPassword.message}
                    </span>
                )}
                {errors.oldPassword?.type === "required" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        Edellytetty kenttä
                    </span>
                )}
                <br />
                <input
                    {...register("newPassword", { required: true })}
                    type="password"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Salasana"
                />
                {errors.newPassword?.type === "required" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        Edellytetty kenttä
                    </span>
                )}
                <br />
                <input
                    {...register("newPasswordAgain", {
                        required: true,
                        validate: (val: string) =>
                            getValues("newPassword") === val,
                    })}
                    type="password"
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Salasana uudelleen"
                />
                {errors.newPasswordAgain?.type === "required" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        Edellytetty kenttä
                    </span>
                )}
                {errors.newPasswordAgain?.type === "validate" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        Salasanat eivät täsmää.
                    </span>
                )}
                <br />

                <div className="flex justify-end mt-1">
                    <button
                        className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2"
                        type="submit"
                    >
                        <PencilIcon className="inline-block h-3 w-3 mr-1" />
                        Vaihda
                    </button>
                </div>
            </form>
        </div>
    );
}
