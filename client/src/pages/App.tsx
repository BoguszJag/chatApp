import React from 'react';
import Chat from '../components/Chat';
import Sidepanel from '../components/Sidepanel';


function App() {

  return (
    <div className='grid grid-cols-chat border-2 border-black h-dvh bg-gray-950 text-gray-400'>
      <Sidepanel />
      <Chat />
    </div>
  );
}

export default App;
