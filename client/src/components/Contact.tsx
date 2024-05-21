import React from 'react'

type props = {
    id: string,
    username: string,
};

function Contact({id, username}: props) {

    return (
        <div id={id} className='flex justify-normal items-center px-5 border-gray-400 border-b-[1px] hover:bg-gray-500 hover:text-black hover:border-black h-12 w-full'>
            {username}
        </div>
    )
}

export default Contact
