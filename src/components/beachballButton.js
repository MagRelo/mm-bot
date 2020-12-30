import React, { useState } from 'react';

// button styles
import beachball from '../images/mm_ball_image.png';
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

  const [caption, setCaption] = useState('Watch for the beachball...');

  // const [active, setActive] = useState(true);

  async function onClick(e) {
    console.log('send');
    setSending(true);
    setCaption('Sending...');

    const user = await fetch('/api/hitball?discordId=' + discordId).then(
      (response) => {
        if (response.status === 200) {
          console.log('200');
          setCaption('Nice! +10 💸');
          resetUI();
          return response.json();
        } else {
          console.log('error');
          resetUI();
        }
      }
    );

    console.log(user);
  }

  function resetUI() {
    const timer = setTimeout(() => {
      console.log('reset');
      setCaption('Watch for the beachball...');
      setSending(false);
    }, 4000);
  }

  return (
    <div>
      <button
        disabled={!eligible}
        onClick={onClick}
        className="beachball-button"
        style={eligible && !sending ? activeButtonStyle : defaultButtonStyle}
      ></button>

      <div className="beachball-caption">
        {!sending ? (
          <React.Fragment>
            {eligible ? (
              <span>Hit the ball!</span>
            ) : (
              <span>Watch for the beachball...</span>
            )}
          </React.Fragment>
        ) : (
          <span>{caption}</span>
        )}
      </div>

      {/* {JSON.stringify({ active, success, sending })} */}
    </div>
  );
}
