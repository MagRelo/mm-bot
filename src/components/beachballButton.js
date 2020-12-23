import React, { useState, useEffect } from 'react';

// button styles
import beachball from '../images/mm_ball_image.png';
const defaultButtonStyle = { border: 'dashed 1px  #ddd' };
const activeButtonStyle = {
  background: `url(${beachball}) no-repeat center center fixed`,
};

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
        style={active ? activeButtonStyle : defaultButtonStyle}
      ></button>

      <div className="beachball-caption">
        {active ? (
          <span>Hit the beachball! </span>
        ) : (
          <span>When the beachball comes to you, hit it!</span>
        )}
      </div>
    </div>
  );
}
