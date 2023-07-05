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

const getPostByNumber = async (postNumber: number) => {
    const response = await axios.get<PostPreview>(
        `${baseUrl}/number/${postNumber}`
    );
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
    getPostByNumber,
    deletePostFile,
};

export default postsService;
