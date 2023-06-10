import { StoreSlice } from "../hooks/useStore";
import { ImageboardSlice } from "../types";
import imageboardService from "../services/imageboardService";

const createAuthSlice: StoreSlice<ImageboardSlice> = (set) => ({
    imageboardConfig: null,
    initializeImageboard: async () => {
        const imageboardConfig = await imageboardService.getImageboardConfig();
        set(() => ({ imageboardConfig }));
    },
});

export default createAuthSlice;
