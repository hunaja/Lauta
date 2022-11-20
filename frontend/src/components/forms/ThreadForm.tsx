import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useCallback,
} from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useBoard from "../../hooks/useBoard";
import useStore from "../../hooks/useStore";

export interface ThreadFormRef {
    focusTextarea: () => void;
}

const ThreadForm = forwardRef<ThreadFormRef>((_, ref) => {
    const {
        register,
        setFocus,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();
    const board = useBoard();
    const createThread = useStore((state) => state.createThread);
    const navigate = useNavigate();

    const focusTextarea = useCallback(() => {
        setFocus("text");
    }, [setFocus]);

    useEffect(() => {
        focusTextarea();
    }, [focusTextarea]);

    useImperativeHandle(ref, () => ({ focusTextarea }));

    if (!board) return null;

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        const thread = {
            title: data.title,
            post: {
                author: data.author,
                text: data.text,
                email: data.email,
                file: data.file[0],
            },
        };

        createThread(board, thread)
            .then((createdThread) => navigate(`/${board.path}/${createdThread.number}`))
            .catch((e) => {
                setError(e.response?.data?.field ?? "text", {
                    type: "api",
                    message: e.response?.data?.error ?? "Viestiä ei voitu lähettää tuntemattoman virheen vuoksi.",
                }, { shouldFocus: true });
            });
    };

    return (
        <div className="p-2 border-2 border-purple-200 bg-white w-full lg:w-[50%] mx-auto">
            <h2 className="text-xl">Luo lanka</h2>
            <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <input
                        className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                        {...register("author")}
                        placeholder="Nimi"
                    />

                    <br />

                    <input
                        className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                        {...register("email")}
                        placeholder="Sähköpostiosoite"
                    />

                    <input
                        {...register("file")}
                        type="file"
                        className="border-2 m-1 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                        placeholder="Tiedosto"
                    />
                    {errors.file?.type === "api" && <span className="pl-4 text-gray-400 text-sm">{errors.file.message}</span>}
                    <br />
                    <input
                        className="w-full m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                        {...register("title")}
                        placeholder="Otsikko"
                    />
                    <br />
                    <textarea
                        className="w-full m-1 h-40 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-1"
                        {...register("text", { maxLength: 10000 })}
                        placeholder="Langan sisältö"
                    />
                    {errors.text?.type === "api" && <span className="pl-4 text-gray-400 text-sm">{errors.text.message}</span>}
                    <br />
                    <div className="flex justify-end mt-1">
                        <button type="submit" className="bg-purple-500 p-1 text-white p-1 pl-2 pr-2">
                            Luo lanka
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
});

ThreadForm.displayName = "ThreadForm";

export default ThreadForm;
