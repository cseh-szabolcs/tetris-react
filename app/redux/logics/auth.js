
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  AUTH_JOIN,
  AUTH_LEAVE,
  SERVER_AUTH_JOIN,
  SERVER_CXN,
} = actions.types;



/**
 * Implements the login-logic
 *
 */
export const joinLogic = createLogic({
  type: [SERVER_CXN, AUTH_JOIN, SERVER_AUTH_JOIN],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    // auto-login
    if (action.type === SERVER_CXN) {
      let userName = window.sessionStorage.getItem('username');
      if (userName) {
        dispatch(actions.auth.join({ userName }));
      }

      done();
      return;
    }

    // send login-data to server...
    if (action.type === AUTH_JOIN) {
      let oldToken = window.sessionStorage.getItem('token');

      ws.send({
        action: action.type,
        uid: state.auth.uid,
        payload: {
          userName: action.userName,
          token: oldToken,
        },
      });

      done();
      return;
    }

    // handle received login-data
    const token = action.payload.token;
    const userName = action.payload.userName;

    dispatch(actions.auth.joined({ token, userName }));

    window.sessionStorage.setItem('token', token);
    window.sessionStorage.setItem('username', userName);
    done();
  }
});



/**
 * Implements the logout-logic
 *
 */
export const leaveLogic = createLogic({
  type: [AUTH_LEAVE],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    ws.send({
      action: action.type,
      token: state.auth.token,
    });

    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('username');
    done();
  }
});
