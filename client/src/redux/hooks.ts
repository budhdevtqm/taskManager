import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

type AppSelector = TypedUseSelectorHook<RootState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: (selector: (state: RootState) => any) => ReturnType<AppSelector> = useSelector;