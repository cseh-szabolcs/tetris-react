
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {

} = actions.types;



/**
 * Listen on web-socket connection (disconnection)
 *
 */
export const authLogic = createLogic({
  type: ['Foo'],
  latest: true,
  warnTimeout: 0,

  process({ getState, action }, dispatch, done) {

  }
});
