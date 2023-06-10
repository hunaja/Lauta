import axios from "axios";
import { ImagePreview } from "../types";

const baseUrl = "/api/imageboard";

const getImageboardConfig = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const getLatestImages = async () => {
    const response = await axios.get<ImagePreview[]>(
        `${baseUrl}/latest-images`
    );
    return response.data;
};

const imageboardService = {
    getImageboardConfig,
    getLatestImages,
};

export default imageboardService;
