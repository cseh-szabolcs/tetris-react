
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  STONE_INSERTED,
  STONE_ROTATED,
  STONE_MOVED_DOWN,
  STONE_MOVED_LEFT,
  STONE_MOVED_RIGHT,
  STONE_MOVE_DOWN_REJECTED,
  STONE_PULLED_DOWN,
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

    case STONE_INSERTED:
    case STONE_ROTATED:
    case STONE_MOVED_DOWN:
    case STONE_MOVED_LEFT:
    case STONE_MOVED_RIGHT:
    case STONE_PULLED_DOWN:
      return action.newField;

    case STONE_MOVE_DOWN_REJECTED:
      return library.tetris.applyStoneInField(state);

    default:
      return state;
  }
};
