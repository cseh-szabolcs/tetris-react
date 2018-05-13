
import actions from 'tetris-actions';


const {
  GAME_START,
  FIELD_CHANGED,
  FIELD_LINES_RESOLVED,
} = actions.types;


const initialState = {
  countDown: 0,
  fieldBackground: null,
  lastResolvedLines: [],
  linesRemoveDuration: 500,
};



/**
 * Contains the state for layout-stuff
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_START:
      return {
        ...state,
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


    default:
      return state;
  }
};
