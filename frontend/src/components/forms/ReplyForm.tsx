import React, { forwardRef, useImperativeHandle } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Post, PostForm } from "../../types";

interface Props {
    replyThread: (form: PostForm) => Promise<Post>;
}

export interface Ref {
    quotePost: (postId: number) => void;
}

const ReplyForm = forwardRef<Ref, Props>(({ replyThread }, ref) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setFocus,
        reset,
        setError,
        formState: { errors },
    } = useForm();
    const watchText: string = watch("text", "");

    const quotePost = (postId: number) => {
        setFocus("text");

        const text = watchText ?? "";
        let newText = "";
        const makeQuote = (postForm: number) => `>>${postForm}`;

        if (text.trim().length === 0) {
            newText = `${makeQuote(postId)}\n`;
        } else if (text.at(-1) === "\n") {
            newText = `${text}${makeQuote(postId)}\n`;
        } else {
            newText = `${text}\n${makeQuote(postId)}\n`;
        }

        setValue("text", newText);
    };

    useImperativeHandle(ref, () => ({ quotePost }));

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        replyThread({
            ...data,
            file: data.file[0],
        } as PostForm)
            .then(() => reset())
            .catch((e) => {
                setError(
                    e.response?.data?.field ?? "text",
                    {
                        type: "api",
                        message:
                            e.response?.data?.error ??
                            "Viestiä ei voitu lähettää tuntemattoman virheen vuoksi.",
                    },
                    { shouldFocus: true }
                );
            });
    };

    // Press Ctrl+Enter on textarea to submit the reply
    const onTextareaKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (!event.ctrlKey || event.key !== "Enter") return;
        handleSubmit(onSubmit)();
    };

    return (
        <div className="border-2 pr-2 pt-1 pb-1 w-full sm:w-96 border-purple-200 block sm:inline-block bg-white">
            <h3 className="text-xl text-center">Uusi vastaus</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("author", {
                        required: false,
                        minLength: 3,
                        maxLength: 20,
                    })}
                    className="border-2 m-1 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                    placeholder="Nimi"
                />
                {(errors.author?.type === "minLength" ||
                    errors.author?.type === "maxLength") && (
                    <span className="pl-4 text-gray-400 text-sm">
                        Käyttäjänimen on oltava 3-20 merkkiä
                    </span>
                )}

                <input
                    {...register("email")}
                    className="border-2 m-1 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                    placeholder="Sähköpostiosoite"
                />

                <input
                    {...register("file")}
                    type="file"
                    className="border-2 m-1 p-1 w-full border-purple-200 focus:outline-none focus:border-purple-400"
                    placeholder="Tiedosto"
                />
                <br />
                {errors.file?.type === "api" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        {errors.file.message}
                    </span>
                )}

                <textarea
                    {...register("text", {
                        required: false,
                        maxLength: 10000,
                    })}
                    className="w-full h-40 m-1 border-2 border-purple-200 focus:outline-none focus:border-purple-400 p-2"
                    placeholder="Vastauksen sisältö"
                    onKeyDown={onTextareaKeyDown}
                />
                {errors.text?.type === "maxLength" && (
                    <span className="pl-2 text-gray-400 text-sm">
                        Postauksen on oltava alle kymmenen tuhatta merkkiä
                        pitkä.
                    </span>
                )}
                {errors.text?.type === "api" && (
                    <span className="pl-4 text-gray-400 text-sm">
                        {errors.text.message || "asdas"}
                    </span>
                )}
                <div className="flex justify-end mt-1">
                    <button
                        className="bg-purple-400 p-1 text-white"
                        type="submit"
                    >
                        Vastaa
                    </button>
                </div>
            </form>
        </div>
    );
});

ReplyForm.displayName = "ReplyForm";

export default ReplyForm;
