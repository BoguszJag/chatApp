import React from 'react'

type props = {
    currentSidepanelState: string,
    handleSidepanelState:  React.Dispatch<React.SetStateAction<string>>
};

function SidePanelButton({currentSidepanelState, handleSidepanelState}: props) {

    const handleClick = () => {
        if(currentSidepanelState === 'hide') {
            handleSidepanelState('show');
        } else {
            handleSidepanelState('hide');
        };
    };

  return (
    <div onClick={handleClick}  className={'absolute flex align-top top-[50%] p-[6px] text-[34px] rounded-[50%] bg-[#1e2124] b-transition left-[-15px] ' + (currentSidepanelState === 'show' ? 'rotate-180' : '')}>
        <img className='size-[24px]' src='/images/greaterThan.png' />
    </div>
  )
}

export default SidePanelButton
