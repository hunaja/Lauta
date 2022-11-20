import React from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useNavigate } from "react-router";
import useStore from "../../hooks/useStore";
import { LoginForm as LoginFormType } from "../../types";

export default function LoginForm() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const login = useStore((state) => state.login);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        login(data as LoginFormType)
            .then(() => navigate("/dashboard"));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("username")} className="border-2 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400" placeholder="Käyttäjännimi" />
            <br />
            <input {...register("password")} className="border-2 p-1 mt-1 w-full border-purple-200 focus:outline-none focus:border-purple-400" type="password" placeholder="Salasana" />
            <br />
            <div className="flex justify-end m-1">
                <button className="bg-purple-500 p-1 text-white" type="submit">Kirjaudu</button>
            </div>
        </form>
    );
}
