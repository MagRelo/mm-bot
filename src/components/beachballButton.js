import React, { useState } from 'react';

// button styles
import beachball from '../images/bb_gif_3.gif';

const defaultButtonStyle = {
  border: 'dashed 1px  #ddd',
  background: 'inherit',
};
const activeButtonStyle = {
  background: `url(${beachball}) no-repeat center center/contain`,
};

export default BeachBallButton;
function BeachBallButton({ activeUser, targetUser, discordId }) {
  const eligible = activeUser === targetUser;
  // console.log('beachball active:', active);

  const [sending, setSending] = useState(false);

  const [caption, setCaption] = useState('');

  // const [active, setActive] = useState(true);

  async function onClick(e) {
    console.log('send');
    setSending(true);
    setCaption('+10 💸');

    await fetch('/api/hitball?discordId=' + discordId).then((response) => {
      if (response.status === 200) {
        console.log('200');
        resetUI();
        return response.json();
      } else {
        console.log('error');
        resetUI();
      }
    });

    // console.log(user);
  }

  function resetUI() {
    setTimeout(() => {
      // console.log('reset');
      setCaption('');
      setSending(false);
    }, 4000);
  }

  return (
    <div style={{ position: 'sticky' }}>
      {/* <div style={{ position: 'absolute' }}>
        
      </div> */}

      <button
        disabled={!eligible}
        onClick={onClick}
        className="beachball-button"
        style={eligible && !sending ? activeButtonStyle : defaultButtonStyle}
      >
        {<span className="clap-label">{caption}</span>}
      </button>

      <div className="robot-label">
        {!sending ? (
          <React.Fragment>
            {eligible ? (
              <span>Hit the ball!</span>
            ) : (
              <span>Watch for the beachball...</span>
            )}
          </React.Fragment>
        ) : null}
      </div>

      {/* {JSON.stringify({ active, success, sending })} */}
    </div>
  );
}
