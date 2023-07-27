import create from "zustand";

import { TimeStore } from "../types";

export default create<TimeStore>((set) => ({
    time: new Date(),
    setTime: (time) => set({ time }),
}));
