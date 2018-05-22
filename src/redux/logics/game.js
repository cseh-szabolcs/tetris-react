
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  GAME_INIT,
  GAME_START,
  GAME_OVER,
  GAME_PAUSE,
  GAME_PAUSED,
  GAME_COUNT_DOWN,
  GAME_INTERVAL_JUMP_IN,
  FIELD_CHANGED,
  FIELD_NOT_CHANGED,
  STONE_CREATE,
  STONE_MOVE_DOWN,
  STONE_MOVED_DOWN,
  STONE_MOVE_DOWN_REJECTED,
  STONE_PULL_DOWN,
  STONE_INSERT_REJECT,
} = actions.types;



/**
 * Dispatches the signal for the next interval
 *
 */
export const nextLogic = createLogic({
  type: [GAME_START, FIELD_CHANGED, FIELD_NOT_CHANGED],
  latest: true,

  process({ getState, action }, dispatch, done) {
    dispatch(actions.game.next());
    done();
  }
});


/**
 * Dispatches the signal for the next interval
 *
 */
export const gameOverLogic = createLogic({
  type: STONE_INSERT_REJECT,
  latest: true,

  process({ getState, action }, dispatch, done) {
    dispatch(actions.game.over());
    done();
  }
});


/**
 * Dispatches the move-down by an interval.
 *
 */
export const intervalLogic = createLogic({
  type: [
    GAME_COUNT_DOWN,
    GAME_OVER,
    GAME_INTERVAL_JUMP_IN,
    STONE_CREATE,
    STONE_PULL_DOWN,
    STONE_MOVE_DOWN,
    STONE_MOVED_DOWN,
    STONE_MOVE_DOWN_REJECTED,
  ],
  latest: true,

  process({ getState, action, timeout, tetris }, dispatch, done) {
    let state = getState();

    // clear move-down-timeout and return!
    if (action.type === STONE_MOVE_DOWN_REJECTED
      || action.type === GAME_OVER
      || (action.type === GAME_COUNT_DOWN && action.value)
    ){

      timeout({ clear: true });
      done();
      return;
    }

    // clear move-down-timeout and...
    if (action.type === STONE_PULL_DOWN
      || action.type === STONE_MOVE_DOWN
      || action.type === GAME_INTERVAL_JUMP_IN
    ){

      timeout({ clear: true });
    }

    // dispatch new move-down-loop
    timeout({
      callback: () => dispatch(actions.stone.moveDown()),
      duration: () => 2000, //tetris.settings.calcIntervalSpeed(state.game.level),
      then: () => done(),
    });
  }
});


/**
 * Checks if game can be set to pause
 *
 */
export const pauseLogic = createLogic({
  type: GAME_PAUSE,
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    if (!state.game.multiplay && state.game.init && state.game.status === null) {
      dispatch(actions.game.paused(action.value));
    }

    done();
  }
});


/**
 * Handles the count-down interval and the game-pause-feature.
 *
 */
export const countDownLogic = createLogic({
  type: [GAME_INIT, GAME_PAUSED, GAME_COUNT_DOWN],
  latest: true,

  process({ getState, action, timeout }, dispatch, done) {
    let state = getState();

    // when game just started
    if (action.type === GAME_INIT) {
      let value = state.game.multiplay ? 5 : 3;
      dispatch(actions.game.countDown( value ));

      done();
      return;
    }

    // game paused
    if (action.type === GAME_PAUSED) {
      if (action.value) {
        timeout({ clear: true });
      } else {
        dispatch(actions.game.countDown( 3 ));
      }

      done();
      return;
    }

    // count-down expired
    if (state.game.countDown === 0) {
      if (!state.game.running) {
        dispatch(actions.game.start());
      }
      done();
      return;
    }

    // continue count-down
    timeout({
      callback: () => dispatch(actions.game.countDown( state.game.countDown - 1 )),
      duration: () => 1000,
      then: () => done(),
    });
  }
});
