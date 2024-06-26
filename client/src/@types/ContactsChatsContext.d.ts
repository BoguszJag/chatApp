// @types.ContactsChatsContext.ts

export type ContactsChat = {
    id: string,
    username: string,
    last_msg: string,
    sender_id: string,
    displayed: boolean,
    msg_date: string
};

export type ContactsChatsContextType = {
    getContactsChats: () => Promise<void>,
    contactsChats: ContactsChat[] | undefined,
    setContactsChats: React.Dispatch<React.SetStateAction<ContactsChats[] | undefined>>
};
