import { useContext } from "react";
import ChatContext from "../context/ChatProvider";

const useChat = () => {
    const context = useContext(ChatContext);
    return context;
};

export default useChat;