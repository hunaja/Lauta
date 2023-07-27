import { useOutletContext } from "react-router";
import { Board } from "../types";

const useBoard = () => useOutletContext<Board | undefined>();

export default useBoard;
