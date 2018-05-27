
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  MULTIPLAY_INVITE,
  MULTIPLAY_INVITATION,
  MULTIPLAY_START,
  MULTIPLAY_CANCELED,
  ONLINE_STATUS_CHANGE,
  SERVER_ONLINE_JOIN,
  SERVER_ONLINE_LEAVE,
  SERVER_ONLINE_STATUS_CHANGED,
} = actions.types;



/**
 * Implements the logic for online-list
 *
 */
export const onlineLogic = createLogic({
  type: [SERVER_ONLINE_JOIN, SERVER_ONLINE_LEAVE, SERVER_ONLINE_STATUS_CHANGED],
  latest: true,

  process({ getState, action }, dispatch, done) {

    if (action.type === SERVER_ONLINE_JOIN) {

      dispatch(actions.online.join({
        uid: action.payload.user.uid,
        userName: action.payload.user.userName,
        status: action.payload.user.status,
      }));

    } else if (action.type === SERVER_ONLINE_STATUS_CHANGED) {

      dispatch(actions.online.changeStatus({
        uids: action.payload.uids,
        status: action.payload.status,
      }));

    } else {

      dispatch(actions.online.leave({
        uid: action.payload.uid,
      }));
    }

    done();
  }
});



/**
 * Implements the relation-logic between current user and the others
 *
 */
export const relationLogic = createLogic({
  type: [MULTIPLAY_INVITE, MULTIPLAY_INVITATION, MULTIPLAY_START],
  latest: true,

  process({ getState, action }, dispatch, done) {
    const state = getState();
    const otherUid = state.chat.window[action.room].otherUid;

    let relation;

    switch (action.type) {
      case MULTIPLAY_INVITE:
        relation = 'invite';
        break;
      case MULTIPLAY_INVITATION:
        relation = 'invitation';
        break;
      default:
        relation = 'multiplay';
        break;
    }

    dispatch(actions.online.setRelation({
      uid: otherUid,
      room: action.room,
      relation,
    }));

    done();
  }
});


/**
 * Make sure, than my status is marked as available when multiplay-game
 * was canceled (required, when other user closing tab or refresh)
 *
 */
export const statusLogic = createLogic({
  type: MULTIPLAY_CANCELED,
  latest: true,

  process({ getState, action, ws, timeout }, dispatch, done) {
    const state = getState();

    timeout({
      callback: () => {
        if (state.online.users[state.auth.uid].status === 1) {
          return;
        }

        ws.send({
          action: ONLINE_STATUS_CHANGE,
          token: state.auth.token,
          room: action.room,
        });
      },
      unique: false,
      then: () => done(),
      duration: 2200,
    });
  }
});
