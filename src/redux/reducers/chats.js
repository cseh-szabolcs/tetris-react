
import actions from 'tetris-actions';

const {

} = actions.types;


const initialState = {
  chat: {},
  list: [], // contains all room-names
};



/**
 * Contains the state of all chats with other users
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {


    default:
      return state;
  }
};
