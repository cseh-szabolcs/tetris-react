
import {
  GAME_INIT,
  GAME_NEXT,
  GAME_OVER,
  GAME_PAUSE,
  GAME_PAUSED,
  GAME_START,
  GAME_COUNT_DOWN,
  GAME_INTERVAL_JUMP_IN,
  GAME_ASCII_SWITCH,
} from './types';


export const init = ({ multiplay = false, level = 1 }) => {
  return {
    type: GAME_INIT,
    multiplay,
    level,
  };
};

export const start = () => {
  return {
    type: GAME_START,
  };
};

export const pause = ( value ) => {
  return {
    type: GAME_PAUSE,
    value,
  };
};

export const paused = ( value ) => {
  return {
    type: GAME_PAUSED,
    value,
  };
};

export const next = () => {
  return {
    type: GAME_NEXT,
  };
};


export const over = () => {
  return {
    type: GAME_OVER,
  };
};

export const countDown = (value) => {
  return {
    type: GAME_COUNT_DOWN,
    value,
  };
};

export const switchAsciiMode = () => {
  return {
    type: GAME_ASCII_SWITCH,
  };
};


// custom-hook to interval, used in multi-player-mode only

export const intervalJumpIn = () => {
  return {
    type: GAME_INTERVAL_JUMP_IN,
  };
};
