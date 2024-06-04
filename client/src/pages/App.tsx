import React from 'react';
import Chat from '../components/Chat';
import Sidepanel from '../components/Sidepanel';


function App() {

  return (
    <div className='grid grid-cols-chat bg-gray-950 text-gray-400 h-dvh'>
      <Sidepanel />
      <Chat />
    </div>
  );
}

export default App;
