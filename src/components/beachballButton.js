import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import beachball from '../images/bb_gif_3.gif';

function BeachBallButton({ isActive, discordId, beachBallId }) {
  // console.log('state:', currentState, context.caption, isActive);

  return (
    <div>
      {isActive ? (
        <ActiveButton discordId={discordId} beachBallId={beachBallId} />
      ) : (
        <InactiveButton />
      )}
    </div>
  );
}
export default BeachBallButton;

function createMachine(discordId, beachBallId) {
  return Machine({
    id: 'beachBall',
    initial: 'active',
    context: {
      discordId: discordId,
      beachBallId: beachBallId,
      caption: 'init',
    },
    states: {
      inactive: {
        on: { ENABLE: 'active' },
        actions: assign({
          caption: 'Watch for the beachball...',
        }),
      },
      active: {
        on: { CLICK: 'loading', RESET: 'inactive' },
        actions: assign({
          caption: 'Hit the ball!',
        }),
      },
      loading: {
        invoke: {
          id: 'hitBall',
          src: (context, event) =>
            fetch('/api/hitball', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(context),
            }).then((response) => response.json()),
          onDone: {
            target: 'success',
          },
          onError: {
            target: 'failure',
          },
        },
        on: { RESET: 'inactive' },
        actions: assign({
          caption: 'sending...',
        }),
      },
      success: {
        after: {
          3000: 'inactive',
        },
        on: { RESET: 'inactive' },
        actions: assign({
          caption: 'win',
        }),
      },
      failure: {
        after: {
          3000: 'inactive',
        },
        on: { RESET: 'inactive' },
        actions: assign({
          caption: 'fail',
        }),
      },
    },
  });
}

// button styles
const defaultButtonStyle = {
  border: 'dashed 1px  #ddd',
  background: 'inherit',
};
const activeButtonStyle = {
  background: `url(${beachball}) no-repeat center center/contain`,
};

function InactiveButton() {
  return (
    <div>
      <button
        className="beachball-button"
        disabled={true}
        style={defaultButtonStyle}
      ></button>

      <div className="robot-label">
        <span>Watch for the beachball...</span>
      </div>
    </div>
  );
}

function ActiveButton({ discordId, beachBallId }) {
  const beachBallMachine = createMachine(discordId, beachBallId);
  const [state, send] = useMachine(beachBallMachine);

  const context = state.context;
  const currentState = state.value;
  const stateActive = state.matches('active');
  console.log('state:', currentState);

  return (
    <div>
      <button
        className="beachball-button"
        onClick={() => {
          send('CLICK');
        }}
        style={stateActive ? activeButtonStyle : defaultButtonStyle}
      ></button>

      <div className="robot-label">
        <span>{currentState}</span>
      </div>
    </div>
  );
}
