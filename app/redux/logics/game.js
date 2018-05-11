
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  GAME_START,
} = actions.types;



/**
 * Dispatches the move-down by an interval, so now we play Tetris!
 *
 */
export const gameInitLogic = createLogic({
  type: [GAME_INIT],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    dispatch(actions.game.start());
    done();
  }
});
