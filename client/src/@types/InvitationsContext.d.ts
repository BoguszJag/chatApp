// @types.InvitationsContext.ts

export type Invites = {
    receivedInvites: Array<{id: string, invitation_sender: string, sender_username: string}>,
    sentInvites: Array<{id: string, invitation_receiver: string, receiver_username: string}>,
    contacts: Array<{uid: string, username: string}>
};

export type InvitationsContextType = {
    getInvites: () => Promise<void>;
    invites: Invites | null;
    setInvites: React.Dispatch<React.SetStateAction<Invites | null>>;
};