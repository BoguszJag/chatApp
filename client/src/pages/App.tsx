import React from 'react';
import Chat from '../components/Chat';
import Sidepanel from '../components/Sidepanel';


function App() {

  return (
    <div className='grid grid-cols-chat bg-[#1e2124] text-gray-300 h-dvh'>
      <Sidepanel />
      <Chat />
    </div>
  );
}

export default App;
