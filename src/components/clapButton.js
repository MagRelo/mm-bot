import React, { useState, useEffect } from 'react';
import useDimensions from 'react-use-dimensions';

import { useDebounce } from './util';
import { sendClap } from '../sockets';
// import useLongPress from './longpress';

export default function ClapButton({
  roomNumber,
  discordId,
  userName,
  disabled,
}) {
  // get position for css animation
  const [ref, { x, y, width }] = useDimensions();

  const [clapCount, setClapCount] = useState(0);
  const debouncedClapCount = useDebounce(clapCount, 900);

  // send after delay
  useEffect(() => {
    if (debouncedClapCount) {
      // send
      // console.log('sending', debouncedClapCount);
      sendClap({ roomNumber, discordId, userName, amount: debouncedClapCount });

      // reset
      setClapCount(0);
    }
  }, [debouncedClapCount, roomNumber, discordId, userName]);

  const onClick = (e) => {
    // console.log('click triggered');
    explode(x + width / 2, y + width / 2, width);
    setClapCount(clapCount + 1);
  };

  return (
    <div style={{ position: 'sticky' }}>
      <div className="clap-label">
        {clapCount ? (
          <span>
            +<span className="emoji">👏</span>
            {clapCount}
          </span>
        ) : null}
      </div>

      <button
        onClick={onClick}
        ref={ref}
        className="clap-button"
        disabled={disabled}
      >
        CLAP
      </button>
    </div>
  );
}

//- Explosion
//- adapted from "Anchor Click Canvas Animation" by Nick Sheffield
//- https://codepen.io/nicksheffield/pen/NNEoLg/

const colors = ['#00FF00', '#000', 'yellow'];
const bubbles = 25;

const explode = (x, y, width) => {
  let particles = [];
  let ratio = window.devicePixelRatio;
  let c = document.createElement('canvas');
  let ctx = c.getContext('2d');

  // console.log(x, y, width);

  c.style.position = 'absolute';
  c.style.left = x - 100 + 'px';
  c.style.top = y - 100 + 'px';
  c.style.pointerEvents = 'none';

  c.style.width = width + 'px';
  c.style.height = width + 'px';

  c.style.zIndex = 100;
  c.width = width * ratio;
  c.height = width * ratio;

  document.body.appendChild(c);

  for (var i = 0; i < bubbles; i++) {
    particles.push({
      x: c.width / 2,
      y: c.height / 2,
      radius: r(20, 30),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: r(0, 360, true),
      speed: r(8, 20),
      friction: 0.9,
      opacity: r(0, 0.5, true),
      yVel: 0,
      gravity: 0.1,
    });
  }

  render(particles, ctx, c.width, c.height);
  setTimeout(() => document.body.removeChild(c), 1000);
};

const render = (particles, ctx, width, height) => {
  requestAnimationFrame(() => render(particles, ctx, width, height));
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180);
    p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180);

    p.opacity -= 0.01;
    p.speed *= p.friction;
    p.radius *= p.friction;
    p.yVel += p.gravity;
    p.y += p.yVel;

    if (p.opacity < 0 || p.radius < 0) return;

    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });

  return ctx;
};

const r = (a, b, c) =>
  parseFloat(
    (Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(
      c ? c : 0
    )
  );

// document.querySelector('.js-explosion').addEventListener('mouseover', e => );
