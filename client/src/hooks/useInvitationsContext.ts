import React, { useContext } from 'react'
import InvitationsContext from '../context/InvitationsProvider';
import { InvitationsContextType } from '../@types/InvitationsContext';

const useInvitations = () => {
  const context = useContext(InvitationsContext) as InvitationsContextType;
  return context;
}

export default useInvitations;