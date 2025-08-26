// @types.ChatContext.ts
import React from "react";

export type msg = {
        id: string,
        sender_id: string,
        date: string,
        text: string
    }

export type chatType = {
    ID: string, 
    messages: msg[]
    contact: string,
    contactName: string, 
    } | null

export type ChatContextType = {
    chat: chatType,
    setChat: React.Dispatch<React.SetStateAction<chat | null>>,
    getChat: (contactID: string, contactName: string) => Promise<void>,
    messages: msg[] | null,
    getMessages: () => Promise<void>,
    chatLoading: boolean,
    setChatLoading: React.Dispatch<React.SetStateAction<boolean>>,
}