// @types.ContactsChatsContext.ts

export type ContactsChats = [{
    id: string,
    username: string,
    last_msg: string,
    msg_date: string
}];

export type ContactsChatsContextType = {
    getContactsChats: () => Promise<void>,
    contactsChats: ContactsChats | null
};
