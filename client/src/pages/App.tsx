import React, { useEffect } from 'react';
import Chat from '../components/Chat';
import Sidepanel from '../components/Sidepanel';


function App() {

  return (
    <div className='grid grid-cols-chat border-2 border-black h-dvh bg-gray-100'>
      <Sidepanel />
      <Chat />
    </div>
  );
}

export default App;
