
import actions from 'tetris-actions';

const {
  AUTH_JOIN,
  AUTH_JOINED,
  AUTH_LEAVE,
  SERVER_CXN,
  WEBSOCKET_ERROR,
  WINDOW_RESTORE_SLAVE,
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

    case SERVER_CXN:
      return {
        ...state,
        uid: action.payload.uid,
      };

    case AUTH_JOIN:
      return {
        ...state,
        loading: true,
      };

    case AUTH_JOINED:
      return {
        ...state,
        token: action.token,
        userName: action.userName,
        loading: false,
      };

    case AUTH_LEAVE:
      return {
        ...initialState,
        uid: state.uid,
      };

    case WEBSOCKET_ERROR:
      return {
        ...state,
        error: true,
      };

    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.auth) {
        return {
          ...state,
          ...action.masterState.auth,
        };
      }
      return state;

    default:
      return state;
  }
};
