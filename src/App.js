import React, { useEffect, useState } from 'react';
import { initiateSocket, disconnectSocket, subscribeToChat } from './sockets';

import { getParams, formatCurrency } from './components/util';

// import ConsensusButton from './components/consensusButton';
import BeachBallButton from './components/beachballButton';
import ClapButton from './components/clapButton';

import mmLogo from './images/mm_logo.svg';

// User
export const UserContext = React.createContext({});

function App() {
  // get URL params
  const params = getParams(window.location);
  const accessCode = params.accessCode;

  const [user, setUser] = useState(null);
  const [targetUser, setTargetUser] = useState({});

  const [beachBallId, setBeachBallId] = useState(null);
  const [beachBallUserId, setBeachBallUserId] = useState(null);

  // connect
  useEffect(() => {
    initiateSocket({ room: 'general', discordId: accessCode });

    subscribeToChat((err, data) => {
      console.log(data);

      if (err) return console.log(err);
      if (data.user) {
        setUser(data.user);
      }

      if (data.game && data.game.targetUser) {
        setTargetUser(data.game.targetUser);
      }

      if (data.game) {
        if (data.game.beachBallUser) {
          setBeachBallUserId(data.game.beachBallUser._id);
        } else {
          setBeachBallUserId(null);
        }
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [accessCode]);

  return (
    <div>
      {user ? (
        <div className="App">
          <div className="page-container">
            <div className="user-info-grid">
              <img
                src={user.avatarURL}
                alt="avatar"
                height="40px"
                width="40px"
              />
              <div className="name">{user.username}</div>
              <div className="balance">{formatCurrency(user.mmBalance)}</div>
            </div>

            <div className="crowd-actions-grid">
              <div className="beach-ball-section">
                <BeachBallButton
                  isActive={user._id === beachBallUserId}
                  discordId={accessCode}
                  beachBallId={beachBallId}
                />
              </div>
            </div>

            <div className="user-actions-grid">
              <div>
                <div className="robot-label">Now On Stage:</div>
                <div className="on-stage-grid">
                  <div className="on-stage-user">
                    <img
                      src={targetUser.avatarURL}
                      alt="avatar"
                      height="40px"
                      width="40px"
                    />
                    <div className="name">{targetUser.username}</div>
                    <div className="balance">
                      <span className="emoji">👏</span> {targetUser.clap}
                    </div>
                  </div>
                </div>

                <div className="clap-section">
                  <ClapButton
                    userName={user.name}
                    discordId={user.discordId}
                    disabled={user.mmBalance < 1}
                  />
                </div>
              </div>
            </div>

            <footer>
              <img src={mmLogo} alt="moneymail logo" height="32px" />
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
