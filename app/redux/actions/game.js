import {
  GAME_START,
} from './types';



export const start = ({ paused = false, multiPlay = false, level = 1 }) => {
  return {
    type: GAME_START,
    paused,
    multiPlay,
    level,
  };
};
