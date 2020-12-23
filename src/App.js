import React, { useEffect, useState } from 'react';
import { initiateSocket, disconnectSocket, subscribeToChat } from './sockets';

import { getParams, formatCurrency } from './components/util';

import ConsensusButton from './components/consensusButton';
import BeachBallButton from './components/beachballButton';
import ClapButton from './components/clapButton';

// Custom List
export const CustomListContext = React.createContext({});

function App() {
  // get URL params
  const params = getParams(window.location);
  const accessCode = params.accessCode;

  // get from params
  // const [room, setRoom] = useState(params.room || 'general');
  const [user, setUser] = useState(null);

  // connect
  useEffect(() => {
    initiateSocket({ room: 'general', discordId: accessCode });

    subscribeToChat((err, data) => {
      if (err) return console.log(err);
      setUser(data);
    });

    return () => {
      disconnectSocket();
    };
  }, [accessCode]);

  return (
    <CustomListContext.Provider value={{}}>
      {user ? (
        <div className="App">
          <div className="page-container">
            <div className="user-info-grid">
              <div className="name">{user.username}</div>
              <div className="balance">{formatCurrency(user.mmBalance)}</div>
            </div>

            <div className="crowd-actions-grid">
              <div className="beach-ball-section">
                <BeachBallButton
                  active={false}
                  title="Wave!"
                  type="wave"
                  cost="10"
                  payoff="30"
                  threshold="60%"
                />
              </div>
            </div>

            <div className="crowd-actions-grid">
              {/* <ConsensusButton
              active={false}
              title="Start a wave"
              type="wave"
              cost="10"
              payoff="30"
              threshold="60%"
            /> */}
            </div>

            <div className="user-actions-grid">
              <div className="clap-section">
                <ClapButton userName={user.name} userId={user.userId} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </CustomListContext.Provider>
  );
}

export default App;
