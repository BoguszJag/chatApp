import React, { useState } from 'react'
import Contacts from './Contacts';
import AddContacts from './AddContacts';
import LogoutButton from './LogoutButton';
import Invitations from './Invitations';

function Sidepanel() {
  const [switchView, setSwitchView] = useState({viewAddContacts: false, viewInvitations: false});

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

  return (
    <div className='flex flex-col justfiy-normal items-start border-r border-solid border-gray-400'>
        <div className='flex justify-normal items-start w-full'>
          <button className='w-full h-10 border-r-[1px] border-b-[1px] border-gray-400' onClick={handleContactsView}>{switchView.viewAddContacts ? 'Contacts' : 'Add Contacts'}</button>
          <button className='w-full h-10 border-b-[1px] border-gray-400' name='invitations' onClick={handleInvitationsView}>Invitations</button>  
        </div>
        {switchView.viewInvitations ? <Invitations /> : switchView.viewAddContacts ? <AddContacts /> : <Contacts />}
        <LogoutButton />
    </div>
  )
}

export default Sidepanel