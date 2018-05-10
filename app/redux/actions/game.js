import {
  GAME_INIT,
  GAME_START,
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
