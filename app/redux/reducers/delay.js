import actions from 'tetris-actions';
import library from 'tetris-library';

const {
  GAME_INIT,
} = actions.types;


const initialState = {
  time: null,
  value: null,
  callback: null,
};



/**
 * Manages the state of the board (fields)
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case GAME_INIT:
      return {
        ...initialState,
      };


    default:
      return state;
  }
};
