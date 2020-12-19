import React, { useEffect, useState } from 'react';
import {
  initiateSocket,
  disconnectSocket,
  subscribeToChat,
  sendClap,
} from './sockets';

import { getParams } from './components/util';
import ConsensusButton from './components/consensusButton';
import BeachBallButton from './components/beachballButton';
import ClapButton from './components/clapButton';

// Custom List
export const CustomListContext = React.createContext({});

function App() {
  //

  const params = getParams(window.location);
  console.log('params', params);

  // get from params
  const [room, setRoom] = useState(params.room || 'roomtest');
  const [user, setUser] = useState({
    name: params.name || 'test',
    balance: params.balance || 0,
  });

  // connect
  useEffect(() => {
    if (room) initiateSocket(room);

    subscribeToChat((err, data) => {
      if (err) return console.log(err);

      // update user
      // setUser()
    });

    return () => {
      disconnectSocket();
    };
  }, [room]);

  return (
    <CustomListContext.Provider value={{}}>
      <div className="App">
        <div className="page-container">
          <div className="user-info-grid">
            <div className="name">{user.name}</div>
            <div className="balance">{user.balance}</div>
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
            <div>
              <ConsensusButton
                active={false}
                title="Wave!"
                type="wave"
                cost="10"
                payoff="30"
                threshold="60%"
              />
            </div>
            <div>
              <ConsensusButton
                active={false}
                title="Encore!"
                type="encore"
                cost="30"
                payoff="50"
                threshold="80%"
              />
            </div>
          </div>

          <div className="user-actions-grid">
            <div className="clap-section">
              <ClapButton
                active={false}
                title="Clap!"
                type="clap"
                cost="30"
                payoff="50"
                threshold="80%"
              />
            </div>
          </div>
        </div>
      </div>
    </CustomListContext.Provider>
  );
}

export default App;
