
import actions from 'tetris-actions';
import library from 'library';


const {
  GAME_INIT,
  GAME_START,
  GAME_OVER,
  GAME_RESET,
  GAME_PAUSED,
  GAME_COUNT_DOWN,
  GAME_ASCII_SWITCH,
  FIELD_LINES_RESOLVED,
  STONE_MOVED_DOWN,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


let initialState = {
  init: false,
  running: false,
  status: null, // false = lost, true = won (ony possible in two-player-mode)
  paused: false,
  countDown: 0,
  score: 0, // the points what the user made
  time: 0, // current clock
  level: 1, // current level
  moves: 0,  // counts the intervals
  resolved: 0, // counts all resolved lines
  received: 0, // counts all received lines (in two-player-mode only)
  multiplay: false,
  asciiMode: false,
};


/**
 * Contains the common information about the game
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_RESET:
      return initialState;

    case GAME_INIT:
      return {
        ...initialState,
        init: true,
        level: action.level,
        multiplay: action.multiplay,
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
        status: action.won,
      };

    case GAME_PAUSED:
      return {
        ...state,
        paused: action.value,
      };

    case GAME_COUNT_DOWN:
      return {
        ...state,
        countDown: action.value,
      };

    case STONE_MOVED_DOWN:
      return {
        ...state,
        moves: state.moves+1,
      };

    case FIELD_LINES_RESOLVED:
      let resolvedCount = action.lines.length;
      let resolvedState = state.resolved + resolvedCount;

      let points = library.tetris.settings.calcPoints(resolvedCount, state.level);
      let level = state.multiplay
        ? state.level
        : library.tetris.settings.calcLevel(resolvedState);

      return {
        ...state,
        resolved: resolvedState,
        level: level,
        score: state.score + points,
      };

    case GAME_ASCII_SWITCH:
      return {
        ...state,
        asciiMode: !state.asciiMode,
      };

    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.game) {
        return {
          ...state,
          ...action.masterState.game,
        };
      }
      return state;

    default:
      return state;
  }
};
