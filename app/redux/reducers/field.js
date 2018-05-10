import actions from 'tetris-actions';
import library from 'tetris-library';

const {

} = actions.types;


const initialState = [];



/**
 * Manages the state of the board (fields)
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {


    default:
      return state;
  }
};
