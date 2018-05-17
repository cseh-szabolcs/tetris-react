
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
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
    let state = getState();

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
