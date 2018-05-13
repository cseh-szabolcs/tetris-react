
import {
  GAME_INIT,
  GAME_NEXT,
  GAME_OVER,
  GAME_PAUSE,
  GAME_START,
  GAME_COUNT_DOWN,
  GAME_ASCII_SWITCH,
} from './types';


export const init = ({ multiPlay = false, level = 1 }) => {
  return {
    type: GAME_INIT,
    multiPlay,
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
