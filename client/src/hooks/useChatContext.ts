import { useContext } from "react";
import ChatContext from "../context/ChatProvider";
import { ChatContextType } from "../@types/ChatContext";

const useChat = () => {
    const context = useContext(ChatContext) as ChatContextType;
    return context;
};

export default useChat;