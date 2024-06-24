// @types.ContactsChatsContext.ts

export type ContactsChats = [{
    id: string,
    username: string,
    last_msg: string,
    sender_id: string,
    msg_date: string
}];

export type ContactsChatsContextType = {
    getContactsChats: () => Promise<void>,
    contactsChats: ContactsChats | null,
    setContactsChats: React.Dispatch<React.SetStateAction<ContactsChats | null>>
};
