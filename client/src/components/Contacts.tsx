import React, { useState } from 'react'
import Search from './Search'

function Contacts() {
    const [contacts, setContacts] = useState<any>();

  return (
    <div className='w-full'>
        <Search handleUsers={setContacts} apiRoute='/showContacts'/>
    </div>
  )
}

export default Contacts