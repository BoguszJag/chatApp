// @types.InvitationsContext.ts

export type Invites = {
    receivedInvites: Array<{id: string, username: string}>,
    sentInvites: Array<{id: string, username: string}>,
    contacts: Array<{id: string}>
};

export type InvitationsContextType = {
    getInvites: () => Promise<void>;
    invites: Invites | null;
};