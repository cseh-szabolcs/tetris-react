
import actions from 'tetris-actions';


const {
  GAME_INIT,
  GAME_PAUSE,
  GAME_OVER,
  GAME_COUNT_DOWN,
  FIELD_CHANGED,
  FIELD_LINES_RESOLVED,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


const initialState = {
  countDown: 0,
  fieldBackground: null,
  lastResolvedLines: [],
  alert: null,
  linesRemoveDuration: 500,
};



/**
 * Contains the state for layout-stuff
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return {
        ...initialState,
        fieldBackground: (Math.floor(Math.random() * (12 - 1 + 1)) + 1),
      };

    case FIELD_LINES_RESOLVED:
      return {
        ...state,
        lastResolvedLines: action.lines,
      };

    case FIELD_CHANGED:
      return {
        ...state,
        lastResolvedLines: [],
      };

    case GAME_PAUSE:
      return {
        ...state,
        alert: action.value ? "pause" : null,
        alertStyle: null,
      };

    case GAME_COUNT_DOWN:
      return {
        ...state,
        alert: (action.value > 0) ? action.value : null,
        alertStyle: (action.value > 0) ? 'timer' : null,
      };

    case GAME_OVER:
      return {
        ...state,
        alert: 'game over',
        alertStyle: null,
      };

    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.layout) {
        return {
          ...state,
          ...action.masterState.layout,
        };
      }
      return state;

    default:
      return state;
  }
};
