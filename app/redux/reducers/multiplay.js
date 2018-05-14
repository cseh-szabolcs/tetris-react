
import actions from 'tetris-actions';

const {

} = actions.types;


const initialState = {
  status: 0, // 1 = requested, 2 = running
  room: null,
  lines: null,
  level: 1,
  strict: true,
  uid: 0,
  won: null,
  initial: false,
  scoreState: {resolved:0, score:0},
  fieldState: [],
};



/**
 * Contains the state of the current multi-game-session
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {


    default:
      return state;
  }
};
