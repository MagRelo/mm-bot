import React, { useState, useEffect } from 'react';

import { sendClap } from '../sockets';

export default function ClapButton({ roomNumber, userId, userName }) {
  // const { activeSession, user } = useContext(AuthContext);
  // const [active, setActive] = useState(active);

  // useEffect(() => {
  //   return globalHistory.listen((action) => {
  //     setMenuOpen(false);
  //   });
  // }, []);

  const amount = 10;

  function clap() {
    sendClap({ roomNumber, userId, userName, amount });
  }

  return (
    <div style={{ position: 'sticky' }}>
      <button onClick={clap} className="clap-button">
        CLAP
      </button>
    </div>
  );
}
