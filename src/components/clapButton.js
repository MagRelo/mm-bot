import React, { useState, useEffect } from 'react';
// import { Link, globalHistory, useLocation } from '@reach/router';
// import { createConnection } from 'mongoose';

export default ConsensusButton;
function ConsensusButton({ active, type, title, cost, payoff, threshold }) {
  // params:
  // - active
  // - type
  // - title
  // - cost
  // - payoff
  // - threshold

  // states:
  // - inactive => can propose
  // - active => can vote

  // const { activeSession, user } = useContext(AuthContext);
  // const [active, setActive] = useState(active);

  // useEffect(() => {
  //   return globalHistory.listen((action) => {
  //     setMenuOpen(false);
  //   });
  // }, []);

  return (
    <div style={{ position: 'sticky' }}>
      <button className="clap-button">CLAP</button>
    </div>
  );
}
