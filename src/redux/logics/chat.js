
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  CHAT_OPEN,
  CHAT_MESSAGE_SEND,
  SERVER_CHAT_OPEN,
  SERVER_CHAT_MESSAGE,
} = actions.types;



/**
 * When one user opens an chat with another user.
 * This logic is not responsible for messaging.
 *
 */
export const openLogic = createLogic({
  type: [CHAT_OPEN, SERVER_CHAT_OPEN],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    if (action.type === CHAT_OPEN) {

      // check if chat with user already opened
      for (let room in state.chat.window) {
        if (action.recipientUid === state.chat.window[room].otherUid) {
          dispatch(actions.chat.reOpen({room: room}));

          done(); return;
        }
      }

      // connect with other-user
      ws.send({
        action: action.type,
        token: state.auth.token,
        payload: {
          recipientUid: action.recipientUid,
        }
      });

      done(); return;
    }

    // SERVER_CHAT_OPEN

    let initial = (state.auth.uid === action.payload.senderUid);
    let otherUid = initial ? action.payload.recipientUid : action.payload.senderUid;

    dispatch(actions.chat.messageReceived({
      room: action.payload.room,
      otherUid,
      initial,
    }));

    done();
  }
});


/**
 * Implements the messenger-logic between two users.
 *
 */
export const messengerLogic = createLogic({
  type: [CHAT_MESSAGE_SEND, SERVER_CHAT_MESSAGE],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    if (action.type === CHAT_MESSAGE_SEND) {

      ws.send({
        action: action.type,
        token: state.auth.token,
        room: action.room,
        payload: {
          message: action.message,
        },
      });

      done(); return;
    }

    // SERVER_CHAT_MESSAGE

    let initial = (state.auth.uid === action.payload.senderUid);
    let otherUid = initial ? action.payload.recipientUid : action.payload.senderUid;

    dispatch(actions.chat.messageReceived({
      room: action.payload.room,
      otherUid,
      initial,
      message: action.payload.message,
    }));

    done();
  }
});
