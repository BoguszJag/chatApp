import { useContext } from "react";
import SocketContext from "../context/SocketProvider";

const useSocket = () => {
    const context = useContext(SocketContext);
    return context;
}

export default useSocket;