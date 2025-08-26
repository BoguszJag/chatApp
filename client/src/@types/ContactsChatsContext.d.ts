// @types.ContactsChatsContext.ts

export type ContactsChat = {
    userInfo: {
        uid: string,
        username: string
    },
    lastMessage: {
        text: string,
        date: string,
        senderId: string,
        displayed: boolean
    },
};

export type ContactsChatsContextType = {
    getContactsChats: () => Promise<void>,
    contactsChats: ContactsChat[] | undefined,
    setContactsChats: React.Dispatch<React.SetStateAction<ContactsChats[] | undefined>>
};
