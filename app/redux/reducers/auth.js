
import actions from 'tetris-actions';

const {
  AUTH_SERVER_CXN,
  AUTH_SOCKET_ERROR,
} = actions.types;


const initialState = {
  uid: null,
  token: null,
  userName: null,
  loading: false,
  error: false,
};



/**
 * Contains the state of the current authenticated user
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case AUTH_SERVER_CXN:
      return {
        ...state,
        uid: action.payload.uid,
      };

    case AUTH_SOCKET_ERROR:
      return {
        ...state,
        error: true,
      };

    default:
      return state;
  }
};
