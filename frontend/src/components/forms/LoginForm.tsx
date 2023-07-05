import React, { useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useNavigate } from "react-router";
import useAuthStore from "../../hooks/useAuthStore";
import { LoginForm as LoginFormType } from "../../types";

export default function LoginForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
        setError,
    } = useForm();
    const login = useAuthStore((state) => state.login);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        login(data as LoginFormType)
            .then(() => navigate("/dashboard"))
            .catch((e) => {
                setError(
                    e.response?.data?.field ?? "username",
                    {
                        type: "api",
                        message:
                            e.response?.data?.error ??
                            "Ei voitu kirjautua tuntemattoman virheen vuoksi.",
                    },
                    { shouldFocus: true }
                );
            });
    };

    useEffect(() => {
        setFocus("username");
    }, [setFocus]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register("username")}
                className="border-2 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                placeholder="Käyttäjännimi"
            />
            {errors.username?.type === "api" && (
                <span className="pl-4 text-gray-400 text-sm">
                    {errors.username.message}
                </span>
            )}

            <br />
            <input
                {...register("password")}
                className="border-2 p-1 mt-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                type="password"
                placeholder="Salasana"
            />
            {errors.password?.type === "api" && (
                <span className="pl-4 text-gray-400 text-sm">
                    {errors.password.message}
                </span>
            )}

            <br />
            <div className="flex justify-end m-1">
                <button className="bg-purple-500 p-1 text-white" type="submit">
                    Kirjaudu
                </button>
            </div>
        </form>
    );
}
