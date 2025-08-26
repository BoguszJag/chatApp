import React, { useState } from 'react'

type props = {
    id: string,
    username: string,
    invited: boolean,
    invite: (receiver: string, username: string) => void
};

function User({id, username, invited, invite}: props) {
    const [invitedState, setInvitedState] = useState(invited);

    function handleClick() {
        invite(id, username);
        setInvitedState(!invitedState);
    };

    return (
        <div id={id} className='flex justify-normal items-center px-2 py-1 hover:bg-[#40444b] mx-3 rounded-xl h-12'>
            {username}
            {!invitedState ? <button onClick={handleClick} className='ml-auto'><img src='/images/addContact.png' alt='add contact image' className='size-8'/></button> : null}
        </div>
    )
}

export default User