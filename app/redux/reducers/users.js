
import actions from 'tetris-actions';

const {

} = actions.types;


const initialState = {
  online: {}, // contains all online users
  list: [],   // contains just the uid's for the list
};



/**
 * Contains the state of all other authenticated (current online) users
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {


    default:
      return state;
  }
};
