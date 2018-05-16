
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  FIELD_CHANGED,
  GAME_INIT,
  STONE_INSERTED,
  STONE_ROTATED,
  STONE_MOVED_DOWN,
  STONE_MOVED_LEFT,
  STONE_MOVED_RIGHT,
  STONE_MOVE_DOWN_REJECTED,
  STONE_PULLED_DOWN,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


const initialState = [];


/**
 * Contains the state of the board (fields)
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return library.tetris.createField({
        rows: 18,
        cols: 10
      });

    case FIELD_CHANGED:
    case STONE_INSERTED:
    case STONE_ROTATED:
    case STONE_MOVED_DOWN:
    case STONE_MOVED_LEFT:
    case STONE_MOVED_RIGHT:
    case STONE_PULLED_DOWN:
      return action.newField;

    case STONE_MOVE_DOWN_REJECTED:
      return library.tetris.applyStoneInField(state);

    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.field) {
        return action.masterState.field;
      }
      return state;

    default:
      return state;
  }
};
