import React from 'react';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

// button styles
import beachball from '../images/bb_gif_3.gif';
const defaultButtonStyle = {
  border: 'dashed 1px  #ddd',
  background: 'inherit',
};
const activeButtonStyle = {
  background: `url(${beachball}) no-repeat center center/contain`,
};

const beachBallMachine = Machine({
  id: 'beachBall',
  initial: 'active',
  context: {
    userId: undefined,
    caption: '',
  },
  states: {
    inactive: {
      on: { ENABLE: 'active' },
    },
    active: {
      on: { CLICK: 'loading', RESET: 'inactive' },
    },
    loading: {
      invoke: {
        id: 'hitBall',
        src: (context, event) =>
          fetch('/api/hitball?discordId=' + context.userId).then((response) =>
            response.json()
          ),
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'failure',
        },
      },
      on: { RESET: 'inactive' },
    },
    success: {
      after: {
        3000: 'inactive',
      },
      on: { RESET: 'inactive' },
    },
    failure: {
      after: {
        3000: 'inactive',
      },
      on: { RESET: 'inactive' },
    },
  },
});

export default BeachBallButton;
function BeachBallButton({ isActive, discordId }) {
  

// console.log(isActive && state.value === 'active')
  return <div>{isActive ? <ActiveButton/> : <InactiveButton/>}</div>

  // switch (currentState) {
  //   case 'inactive':
  //     console.log('inactive');
  //     return <span>{isActive}</span>;

  //   case 'active':
  //     console.log('active');
  //     return <span>{isActive ? 'active': null}</span>;

  //   default:
  //     break;
  // }
}

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

function ActiveButton() {
  // init state machine
  const [state, send] = useMachine(beachBallMachine);
  const currentState = state.value;
  const stateActive = state.matches('active');
  console.log('state:', state.value);

  return (
    <div>
      <button
        className="beachball-button"
        onClick={() => {
          console.log('sending')
          send('CLICK')
          console.log(state.value)
        }}
        // style={activeButtonStyle}
      >

        {state.value}
      </button>

      <div className="robot-label">
        <span>Hit the Ball!</span>
      </div>
    </div>
  );
}
