import React, { useState } from 'react'

type props = {
    id: string,
    username: string,
    invited: boolean,
    invite: (receiver: string) => void
};

function User({id, username, invited, invite}: props) {
    const [invitedState, setInvitedState] = useState(invited);

    function handleClick() {
        invite(id);
        setInvitedState(!invitedState);
    };

    return (
        <div id={id} className='flex justify-normal items-center px-5 border-black border-b-[1px] hover:bg-gray-300 h-12 w-full'>
            {username}
            {!invitedState ? <button onClick={handleClick} className='ml-auto'><img src='/images/addContact.png' alt='add contact image' className='size-8'/></button> : null}
        </div>
    )
}

export default User