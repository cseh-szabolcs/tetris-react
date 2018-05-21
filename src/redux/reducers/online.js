
import actions from 'tetris-actions';

const {
  AUTH_UID_RECEIVED,
  ONLINE_JOIN,
  ONLINE_LEAVE,
  ONLINE_RELATION,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


const initialState = {
  users: {}, // contains all online users
  list: [],   // contains just the uid's for the list
};


/**
 * Contains the state of all other authenticated (current online) users
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case AUTH_UID_RECEIVED:
      return { ...state,
        users: action.onlineUsers,
        list: action.onlineUids,
      };


    case ONLINE_JOIN:
      return { ...state,
        users: { ...state.users,
          [action.uid]: {
            uid: action.uid,
            userName: action.userName,
            relation: false,
            room: null,
          },
        },
        list: [...state.list, action.uid],
      };


    case ONLINE_RELATION:
      if (state.list.indexOf(action.uid) === -1) {
        return state;
      }

      return { ...state,
        users: { ...state.uid,
          [action.uid]: { ...state.users[action.uid],
            relation: action.relation,
            room: action.room,
          }
        }
      };


    case ONLINE_LEAVE:
      if (state.list.indexOf(action.uid) === -1) {
        return state;
      }

      return { ...state,
        list: state.list.filter(e => e !== action.uid),
      };


    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.online) {
        return {  ...state,
          ...action.masterState.online,
        };
      }
      return state;

    default:
      return state;
  }
};
