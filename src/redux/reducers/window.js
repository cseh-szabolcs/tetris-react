
import actions from 'tetris-actions';


const {
  WINDOW_RESTORE_SLAVE,
  WINDOW_PING_FAILED,
} = actions.types;


let initialState = {
  masterTab: true,
  pingFailed: false,
};


/**
 * This reducer is only for components-behaviour-purposed (design)
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case WINDOW_RESTORE_SLAVE:
      return {
        ...state,
        masterTab: false,
      };

    case WINDOW_PING_FAILED:
      return {
        ...state,
        pingFailed: true,
      };

    default:
      return state;
  }
};
