import axios from "axios";
import { Post, PostForm, CatalogThread, Thread } from "../types";

const getAll = async () => {
    const response = await axios.get<CatalogThread[]>("/api/threads");
    return response.data;
};

const getThreadByNumber = async (number: number) => {
    const response = await axios.get<Thread>(`/api/threads/number/${number}`);
    return response.data;
};

const reply = async (thread: Thread, postForm: PostForm) => {
    const formData = new FormData();
    formData.append("text", postForm.text);
    formData.append("email", postForm.email);
    formData.append("author", postForm.author);
    if (postForm.file) formData.append("file", postForm.file);

    const response = await axios.post<Post>(
        `/api/threads/${thread.id}/replies`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

const remove = async (jwtToken: string, thread: Thread) => {
    await axios.delete(`/api/threads/${thread.id}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
};

const threadsService = {
    getAll,
    getThreadByNumber,
    remove,
    reply,
};

export default threadsService;
