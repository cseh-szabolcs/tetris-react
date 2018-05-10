import actions from 'tetris-actions';
import library from 'tetris-library';

const {
  GAME_INIT,
} = actions.types;


const initialState = [];



/**
 * Manages the state of the board (fields)
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return library.tetris.createField({
        rows: 18,
        cols: 10
      });

    default:
      return state;
  }
};
