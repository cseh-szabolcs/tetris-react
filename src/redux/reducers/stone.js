
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  STONE_CREATE,
  STONE_MOVED_DOWN,
  STONE_MOVE_DOWN_REJECTED,
  STONE_MOVED_LEFT,
  STONE_MOVED_RIGHT,
  STONE_PULLED_DOWN,
  STONE_ROTATED,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


const initialState = {
  current: null,
  next: null,
  xPos: 3,
  yPos: 0,
  rotation: null,
  moves: 0, // counts all kind of moves (left, right, down)
  inserted: 0, // contains the count of all in the field inserted stones
  resolved: 0, // contains the count of last-resolved lines by this stone
};



/**
 * Contains the state of the stone
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return {
        ...initialState,
      };

    case STONE_CREATE:
      return {
        ...initialState,
        current: action.current,
        next: action.next,
        yPos: (action.current.left[0].indexOf(1) === -1) ? -1 : 0,
        rotation: library.tetris.getNextRotation(),
        inserted: state.inserted + 1,
      };

    case STONE_MOVED_DOWN:
      return {
        ...state,
        yPos: state.yPos + 1,
        moves: state.moves + 1,
      };

    case STONE_MOVED_LEFT:
      return {
        ...state,
        xPos: state.xPos - 1,
        moves: state.moves + 1,
      };

    case STONE_MOVED_RIGHT:
      return {
        ...state,
        xPos: state.xPos + 1,
        moves: state.moves + 1,
      };

    case STONE_PULLED_DOWN:
      return {
        ...state,
        yPos: action.yPos,
        moves: state.moves + 1,
      };

    case STONE_ROTATED:
      return {
        ...state,
        rotation: library.tetris.getNextRotation(state.rotation),
      };

    case STONE_MOVE_DOWN_REJECTED:
      return {
        ...state,
        current: null,
      };

    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.stone) {
        return {
          ...state,
          ...action.masterState.stone,
        };
      }
      return state;

    default:
      return state;
  }
};
