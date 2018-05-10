import actions from 'tetris-actions';
import library from 'tetris-library';

const {
  GAME_INIT,
} = actions.types;


let initialState = {
  init: false,
  status: null, // null = initial, true = running/won, false = lost
  paused: false,
  score: 0, // the points what the user made
  time: 0, // current clock
  level: 1, // current level
  moves: 0,  // counts the intervals
  resolved: 0, // counts all resolved lines
  received: 0, // counts all received lines (in two-player-mode only)
  multiPlay: false,
  asciiMode: false,
};


/**
 * Contains the common information about the game
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return {
        ...initialState,
        init: true,
        level: action.level,
        multiPlay: action.multiPlay,
      };

    default:
      return state;
  }
};
