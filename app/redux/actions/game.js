
import {
  GAME_INIT,
  GAME_NEXT,
  GAME_START,
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


export const next = () => {
  return {
    type: GAME_NEXT,
  };
};


export const switchAsciiMode = () => {
  return {
    type: GAME_ASCII_SWITCH,
  };
};
