import React from 'react'

type props = {
    id: string,
    username: string
}

function Invitation({id, username}: props) {
  return (
    <div key={id}>
      {username}
    </div>
  )
}

export default Invitation
