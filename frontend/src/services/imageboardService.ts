import axios from "axios";
import { ImagePreview } from "../types";

const baseUrl = "/api/imageboard";

const getLatestImages = async () => {
    const response = await axios.get<ImagePreview[]>(
        `${baseUrl}/latest-images`
    );
    return response.data;
};

const imageboardService = {
    getLatestImages,
};

export default imageboardService;
