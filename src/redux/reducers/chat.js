
import actions from 'tetris-actions';

const {
  CHAT_MESSAGE_RECEIVED,
  CHAT_WINDOW_CLOSE,
  CHAT_WINDOW_FOCUS,
  CHAT_WINDOW_OPEN,
  MULTIPLAY_INVITATION,
  MULTIPLAY_START,
  WINDOW_RESTORE_SLAVE,
} = actions.types;


const initialState = {
  window: {},
  list: [], // contains all room-names
  focused: null,
};


/**
 * Contains the state of all chats with other users
 *
 */
export default (state = initialState, action) => {
  let room, newState;

  switch (action.type) {

    case CHAT_MESSAGE_RECEIVED:
      room = action.room;

      newState = {
        ...state,
      };

      // init chat-window when no conversation with the other-user exists
      if (state.list.indexOf(room) === -1) {

        newState.list = [...state.list, room];
        newState.window = { ...state.window,
          [room]: {
            room: room,
            otherUid: action.otherUid,
            alert: null,
            messages: [],
          }
        };
      }

      newState.window[room] = { ...newState.window[room],
        otherUid: action.otherUid, // other-uid can change, so we always rewrite *1!
        display: (newState.window[room].display || !!action.initial || !!action.message),
      };

      if (!action.message) {

        return newState;
      }

      // CORE: A new message received
      newState.window[room] = { ...newState.window[room],
        otherUid: action.otherUid, // *1!
        messages: [...newState.window[room].messages,
          {body: action.message, initial: action.initial},
        ]
      };

      return newState;


    case CHAT_WINDOW_OPEN:
      room = action.room;

      return { ...state,
        focused: room,
        window: { ...state.window,
          [room]: { ...state.window[room],
            display: true,
          }
        }
      };


    case CHAT_WINDOW_CLOSE:
      room = action.room;

      return { ...state,
        window: { ...state.window,
          [room]: { ...state.window[room],
            display: false,
          }
        }
      };


    case CHAT_WINDOW_FOCUS:
      return { ...state,
        focused: action.room,
      };


    case MULTIPLAY_INVITATION:
    case MULTIPLAY_START:
      room = action.room;

      return { ...state,
        window: { ...state.window,
          [room]: { ...state.window[room],
            display: true,
            alert: getAlertString(action.type),
          }
        }
      };


    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.chat) {
        return {
          ...state,
          ...action.masterState.chat,
        };
      }
      return state;


    default:
      return state;
  }
};



function getAlertString (actionType) {
  switch (actionType) {
    case MULTIPLAY_INVITATION:
      return 'invitation';
    case MULTIPLAY_START:
      return 'multiplay';
    default:
      return null;
  }
}
