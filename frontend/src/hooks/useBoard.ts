import { useOutletContext } from "react-router";
import { Board } from "../types";

const useBoard = () => useOutletContext<Board | null>();

export default useBoard;
