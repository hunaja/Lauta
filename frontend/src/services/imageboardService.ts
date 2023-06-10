import axios from "axios";

const baseUrl = "/api/imageboard";

const getImageboardConfig = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const getLatestImages = async () => {
    const response = await axios.get(`${baseUrl}/latest-images`);
    return response.data;
};

const actions = {
    getImageboardConfig,
    getLatestImages,
};

export default actions;
