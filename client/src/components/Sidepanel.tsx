import React, { useEffect, useState } from 'react'
import Contacts from './Contacts';
import AddContacts from './AddContacts';
import LogoutButton from './LogoutButton';
import Invitations from './Invitations';
import useInvitations from '../hooks/useInvitationsContext';
import useContactsChats from '../hooks/useContactsChatsContext';

function Sidepanel() {
  const [switchView, setSwitchView] = useState({viewAddContacts: false, viewInvitations: false});
  const {getInvites} = useInvitations();
  const {getContactsChats} = useContactsChats();

  function handleContactsView() {
    if(switchView.viewInvitations === true) {
      setSwitchView(prev => {
        return {...prev, viewInvitations: false}
      });
    } else setSwitchView({viewInvitations: false, viewAddContacts: !switchView.viewAddContacts});
  };

  function handleInvitationsView() {
    setSwitchView(prev => {
      return {...prev, viewInvitations: !switchView.viewInvitations}
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timer | undefined;

    if(switchView.viewInvitations) {
      getInvites();
      timer = setInterval(() => {
        getInvites();
      }, 5000);
    };

    if(!switchView.viewInvitations) {
      getContactsChats();
    };

    return (() => {
      clearInterval(timer);
    })

  }, [switchView.viewInvitations]);

  return (
    <div className='flex flex-col justfiy-normal items-start border-x border-solid border-gray-400 h-full'>
        <div className='flex justify-normal items-start w-full'>
          <button className='w-full h-10 border-r border-y border-gray-400' onClick={handleContactsView}>{switchView.viewAddContacts ? 'Contacts' : 'Add Contacts'}</button>
          <button className='w-full h-10 border-y border-gray-400' name='invitations' onClick={handleInvitationsView}>Invitations</button>  
        </div>
        {switchView.viewInvitations ? <Invitations /> : switchView.viewAddContacts ? <AddContacts /> : <Contacts />}
        <LogoutButton />
    </div>
  )
}

export default Sidepanel