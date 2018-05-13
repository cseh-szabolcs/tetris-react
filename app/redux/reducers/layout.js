
import actions from 'tetris-actions';


const {
  FIELD_CHANGED,
  FIELD_LINES_RESOLVED,
} = actions.types;


const initialState = {
  countDown: 0,
  lastResolvedLines: [],
  linesRemoveDuration: 500,
};



/**
 * Contains the state for layout-stuff
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

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


    default:
      return state;
  }
};
