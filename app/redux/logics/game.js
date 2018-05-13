
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  GAME_START,
  FIELD_CHANGED,
  FIELD_NOT_CHANGED,
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


/**
 * Dispatches the signal for the next interval
 *
 */
export const gameNextLogic = createLogic({
  type: [GAME_START, FIELD_CHANGED, FIELD_NOT_CHANGED],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    dispatch(actions.game.next());
    done();
  }
});


/**
 * Dispatches the move-down by an interval.
 *
 */
export const gameIntervalLogic = createLogic({
  type: ['FOOOOO'],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    if (false) {
      library.tetris.timeout({ clear: true });
      done();
      return;
    }


    // dispatch new move-down-loop
    library.tetris.timeout({
      callback: () => dispatch(actions.stone.moveDown()),
      duration: () => library.tetris.settings.calcIntervalSpeed(state.game.level),
      than: () => done(),
    });
  }
});