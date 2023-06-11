import axios from "axios";
import {
    Board,
    Post,
    PostForm,
    PostPreview,
    Thread,
    ThreadForm,
} from "../types";

const boardsBaseUrl = (board: Board) => `/api/boards/${board.id}/threads`;

const getPreviews = async (board: Board, page = 0): Promise<Thread[]> => {
    const response = await axios.get(boardsBaseUrl(board), {
        params: { page },
    });
    return response.data;
};

const create = async (
    board: Board,
    threadForm: ThreadForm
): Promise<Thread> => {
    const formData = new FormData();
    formData.append("title", threadForm.title);
    formData.append("text", threadForm.post.text);
    formData.append("email", threadForm.post.email);
    formData.append("author", threadForm.post.author);
    if (threadForm.post.file) formData.append("file", threadForm.post.file);

    const response = await axios.post(boardsBaseUrl(board), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

const getThreadByNumber = async (number: number): Promise<Thread> => {
    const response = await axios.get(`/api/threads/number/${number}`);
    return response.data;
};

const reply = async (thread: Thread, postForm: PostForm): Promise<Post> => {
    const formData = new FormData();
    formData.append("text", postForm.text);
    formData.append("email", postForm.email);
    formData.append("author", postForm.author);
    if (postForm.file) formData.append("file", postForm.file);

    const response = await axios.post(
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

const deletePost = async (jwtToken: string, post: Post): Promise<void> => {
    await axios.delete(`/api/posts/${post.id}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
};

const getPostByNumber = async (postNumber: number) => {
    const response = await axios.get<PostPreview>(
        `/api/posts/number/${postNumber}`
    );
    return response.data;
};

const deletePostFile = async (jwtToken: string, post: Post): Promise<void> => {
    await axios.delete(`/api/posts/${post.id}/file`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
};

const threadsService = {
    getPreviews,
    create,
    getThreadByNumber,
    reply,
    deletePost,
    getPostByNumber,
    deletePostFile,
};

export default threadsService;
