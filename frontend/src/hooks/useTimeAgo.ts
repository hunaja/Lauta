import { fi } from "date-fns/locale";
import { formatDistance } from "date-fns";

import useTimeStore from "./useTimeStore";

export default function useTimeAgo(timestamp: string): string {
    const time = useTimeStore((state) => state.time);

    const timeAgo = formatDistance(new Date(timestamp), time, {
        locale: fi,
        addSuffix: true,
    });

    return timeAgo;
}
