import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { SaveIcon } from "@heroicons/react/solid";
import { Board, BoardWithoutId } from "../../types";

interface BoardFormProps {
    oldBoard?: Board;
    buttonText: string;
    onSubmit: (board: BoardWithoutId) => void;
}

export default function BoardForm({
    oldBoard,
    buttonText,
    onSubmit,
}: BoardFormProps) {
    const { register, handleSubmit } = useForm({
        defaultValues: oldBoard,
    });

    const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
        onSubmit(data as BoardWithoutId);
    };

    return (
        <div className="p-1">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                    {...register("path", { required: true })}
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Osoite"
                />
                <br />
                <input
                    {...register("name", { required: true })}
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Nimi"
                />
                <br />
                <input
                    {...register("title", { required: true })}
                    className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                    placeholder="Otsikko"
                />
                <br />

                <div className="flex justify-end mt-1">
                    <button
                        className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2"
                        type="submit"
                    >
                        <SaveIcon className="inline-block h-3 w-3 mr-1" />
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

BoardForm.defaultProps = {
    oldBoard: undefined,
};
