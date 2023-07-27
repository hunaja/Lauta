import useSWR from "swr";
import imageboardService from "../services/imageboardService";

export default function useLatestImages() {
    const { data: latestImages } = useSWR(
        "/api/latest-images",
        imageboardService.getLatestImages,
        {
            refreshInterval: 10000,
        }
    );

    return { latestImages };
}
