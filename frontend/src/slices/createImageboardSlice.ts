import { StoreSlice } from "../hooks/useStore";
import { ImageboardSlice } from "../types";
import imageboardService from "../services/imageboardService";

const createAuthSlice: StoreSlice<ImageboardSlice> = (set) => ({
    latestImages: null,
    imageboardConfig: null,
    initializeImageboard: async () => {
        const imageboardConfig = await imageboardService.getImageboardConfig();
        set(() => ({ imageboardConfig }));
    },
    initializeLatestImages: async () => {
        const latestImages = await imageboardService.getLatestImages();
        set(() => ({ latestImages }));
    },
});

export default createAuthSlice;
