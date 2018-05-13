
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  GAME_INIT,
  GAME_PAUSE,
  GAME_START,
  GAME_COUNT_DOWN,
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
    let state = getState();

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
    let state = getState();

    dispatch(actions.game.over());
    done();
  }
});


/**
 * Dispatches the move-down by an interval.
 *
 */
export const intervalLogic = createLogic({
  type: [GAME_COUNT_DOWN, STONE_CREATE, STONE_PULL_DOWN, STONE_MOVE_DOWN, STONE_MOVED_DOWN, STONE_MOVE_DOWN_REJECTED],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    // clear move-down-timeout and return!
    if (action.type === STONE_MOVE_DOWN_REJECTED || (action.type === GAME_COUNT_DOWN && action.value)) {
      library.tetris.timeout({ clear: true });
      done();
      return;
    }

    // clear move-down-timeout and...
    if (action.type === STONE_PULL_DOWN || action.type === STONE_MOVE_DOWN) {
      library.tetris.timeout({ clear: true });
    }

    // ...dispatch new move-down-loop
    library.tetris.timeout({
      callback: () => dispatch(actions.stone.moveDown()),
      duration: () => library.tetris.settings.calcIntervalSpeed(state.game.level),
      than: () => done(),
    });
  }
});


/**
 * Handles the count-down interval and the game-pause-feature.
 *
 */
export const countDownLogic = createLogic({
  type: [GAME_INIT, GAME_PAUSE, GAME_COUNT_DOWN],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    // when game just started
    if (action.type === GAME_INIT) {
      let value = state.game.multiPlay ? 5 : 3;
      dispatch(actions.game.countDown( value ));

      done();
      return;
    }

    // game paused
    if (action.type === GAME_PAUSE) {
      if (state.game.multiPlay) {
        done();
        return;
      }

      if (action.value) {
        library.tetris.timeout({ clear: true });
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
    library.tetris.timeout({
      callback: () => dispatch(actions.game.countDown( state.game.countDown - 1 )),
      duration: () => 1000,
      than: () => done(),
    });
  }
});
