
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  MULTIPLAY_INVITE,
  MULTIPLAY_INVITATION,
  MULTIPLAY_START,
  SERVER_ONLINE_JOIN,
  SERVER_ONLINE_LEAVE,
} = actions.types;



/**
 * Implements the logic for online-list
 *
 */
export const onlineLogic = createLogic({
  type: [SERVER_ONLINE_JOIN, SERVER_ONLINE_LEAVE],
  latest: true,

  process({ getState, action }, dispatch, done) {

    if (action.type === SERVER_ONLINE_JOIN) {

      dispatch(actions.online.join({
        uid: action.payload.user.uid,
        userName: action.payload.user.userName,
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
