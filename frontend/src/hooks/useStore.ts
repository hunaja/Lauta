import create, { GetState, SetState } from "zustand";
import { Store } from "../types";

import createImageboardSlice from "../slices/createImageboardSlice";
import createAuthSlice from "../slices/createAuthSlice";

export type StoreSlice<T extends object, E extends object = T> = (
    set: SetState<E extends T ? E : E & T>,
    get: GetState<E extends T ? E : E & T>
) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRootSlice = (
    set: SetState<Partial<Store>>,
    get: GetState<any>
) => ({
    ...createImageboardSlice(set, get),
    ...createAuthSlice(set, get),
});

export default create<Store>()(createRootSlice);
