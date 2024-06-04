// @types.ChatContext.ts
import React from "react";

export type msg = {
        msg_id: string,
        sender_id: string,
        date: string,
        msg_text: string
    }

export type chat = {messages: Array<msg>, contactID: string};

export type ChatContextType = {
    chat: chat | null,
    setChat: React.Dispatch<React.SetStateAction<chat | null>>,
    getChat: (contactID: string) => Promise<void>,
    currentSocket: Socket
}