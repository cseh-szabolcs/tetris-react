
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  GAME_START,
  GAME_OVER,
  GAME_PAUSE,
  GAME_COUNT_DOWN,
  GAME_ASCII_SWITCH,
} = actions.types;


let initialState = {
  init: false,
  running: false,
  status: null, // true = won, false = lost
  paused: false,
  countDown: 0,
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

    case GAME_START:
      return {
        ...state,
        running: true,
      };

    case GAME_OVER:
      return {
        ...state,
        running: false,
        status: false,
      };

    case GAME_PAUSE:
      if (state.multiPlay) {
        return state;
      }
      return {
        ...state,
        paused: action.value,
      };

    case GAME_COUNT_DOWN:
      return {
        ...state,
        countDown: action.value,
      };

    case GAME_ASCII_SWITCH:
      return {
        ...state,
        asciiMode: !state.asciiMode,
      };

    default:
      return state;
  }
};
