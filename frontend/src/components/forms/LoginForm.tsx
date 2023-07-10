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
            <label htmlFor="username" className="text-sm">
                <span className="sr-only">Käyttäjännimi</span>
                <input
                    {...register("username", {
                        required: true,
                    })}
                    className="border-2 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                    placeholder="Käyttäjännimi"
                    id="username"
                    aria-invalid={Boolean(errors.username)}
                    aria-errormessage="username-error"
                />
            </label>
            {Boolean(errors.username) && (
                <span
                    className="pl-4 text-gray-400 text-sm"
                    id="username-error"
                    role="alert"
                >
                    {errors.username.type === "api" && errors.username.message}
                    {errors.username.type !== "api" &&
                        "Käyttäjännimi on pakollinen kenttä."}
                </span>
            )}

            <br />

            <label htmlFor="password" className="text-sm">
                <span className="sr-only">Salasana</span>
                <input
                    {...register("password", {
                        required: true,
                    })}
                    className="border-2 p-1 mt-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                    type="password"
                    placeholder="Salasana"
                    id="password"
                    aria-invalid={Boolean(errors.username)}
                    aria-errormessage="password-error"
                />
            </label>
            {Boolean(errors.password) && (
                <span
                    className="pl-4 text-gray-400 text-sm"
                    id="password-error"
                    role="alert"
                >
                    {errors.password.type === "api" && errors.password.message}
                    {errors.password.type !== "api" &&
                        "Salasana on pakollinen kenttä."}
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
