
import actions from 'tetris-actions';


const {
  WINDOW_RESTORE_SLAVE
} = actions.types;


let initialState = {
  masterTab: true,
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

    default:
      return state;
  }
};
