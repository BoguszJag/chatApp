import React, { useContext } from 'react'
import InvitationsContext from '../context/InvitationsProvider';

const useInvitations = () => {
  const context = useContext(InvitationsContext);
  return context;
}

export default useInvitations;