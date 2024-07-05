import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import Sidepanel from '../components/Sidepanel';
import SidePanelButton from '../components/SidePanelButton';


function App() {
  const [sidepanelState, setSidepanelState] = useState('hide');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
   
  },[]);

  return (
    <div className={`relative grid bg-[#1e2124] text-gray-300 h-dvh overflow-hidden ` + (windowWidth >= 1024 ? 'grid-cols-chat' : 'sidepanel-' + sidepanelState)}>
      {sidepanelState === 'hide' && windowWidth < 1024 ? null : <Sidepanel windowWidth={windowWidth}/>}
      {windowWidth < 1024 ? <SidePanelButton currentSidepanelState={sidepanelState} handleSidepanelState={setSidepanelState}/> : null}
      {sidepanelState === 'show' && windowWidth < 1024 ? null : <Chat windowWidth={windowWidth}/>}
    </div>
  );
}

export default App;
