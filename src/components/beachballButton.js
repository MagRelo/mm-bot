import React, { useState, useEffect } from 'react';
// import { Link, globalHistory, useLocation } from '@reach/router';
// import { createConnection } from 'mongoose';

import beachball from '../images/beachball.svg';
// import BeachBall from '';

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
  // - inactive => button inactive, disabled
  // - active => button active, throw ball, timer
  // useEffect(() => {
  //   return globalHistory.listen((action) => {
  //     setMenuOpen(false);
  //   });
  // }, []);

  return (
    <div>
      <button
        disabled={!active}
        className="beachball-button"
        style={{ backgroundImage: `url(${beachball})` }}
      ></button>
    </div>
  );
}
