import axios from "axios";
import { Post, PostPreview } from "../types";

const baseUrl = "/api/posts";

const deletePost = async (jwtToken: string, post: Post) => {
    await axios.delete(`${baseUrl}/${post.id}`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
};

const getPost = async (postNumber: number) => {
    const response = await axios.get<PostPreview>(`${baseUrl}/${postNumber}`);
    return response.data;
};

const deletePostFile = async (jwtToken: string, post: Post) => {
    await axios.delete(`${baseUrl}/${post.id}/file`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    });
};

const postsService = {
    deletePost,
    getPost,
    deletePostFile,
};

export default postsService;
