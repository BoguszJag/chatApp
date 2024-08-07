import React, { useEffect, useState } from 'react'
import Contacts from './Contacts';
import AddContacts from './AddContacts';
import LogoutButton from './LogoutButton';
import Invitations from './Invitations';
import useInvitations from '../hooks/useInvitationsContext';
import useContactsChats from '../hooks/useContactsChatsContext';

type props = {
  windowWidth: number,
  handleSidepanelState: React.Dispatch<React.SetStateAction<string>>
};

function Sidepanel({windowWidth, handleSidepanelState}: props) {
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
    <div className={'flex flex-col justfiy-normal items-start h-[98dvh] m-2 mr-0 rounded-3xl bg-[#2f3136] shadow-lg ' + (windowWidth < 1024 ? 'mr-2' : null)}>
        <div className='flex justify-normal items-start w-full'>
          <button className='w-1/2 h-10 bg-[#282b30] rounded-tl-3xl hover:bg-[#40444b] hover:rounded-tl-3xl overflow-hidden text-nowrap' onClick={handleContactsView}>{switchView.viewAddContacts ? 'Contacts' : 'Add Contacts'}</button>
          <button className='w-1/2 h-10 bg-[#282b30] rounded-tr-3xl hover:bg-[#40444b] hover:rounded-tr-3xl overflow-hidden' name='invitations' onClick={handleInvitationsView}>Invitations</button>  
        </div>
        {switchView.viewInvitations ? <Invitations /> : switchView.viewAddContacts ? <AddContacts /> : <Contacts handleSidepanelState={handleSidepanelState}/>}
        <LogoutButton />
    </div>
  )
}

export default Sidepanel