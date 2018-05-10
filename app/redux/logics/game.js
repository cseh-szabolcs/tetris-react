import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';

const {
  FIELD_STONE_INSERTED,
  FIELD_OVERFLOW,
  GAME_PAUSE,
  GAME_RESET,
  GAME_START_DELAY,
  STONE_MOVED_DOWN,
  STONE_PULLED_DOWN,
} = actions.types;



/**
 * Dispatches the move-down by an interval, so now we play Tetris!
 *
 */
export const gameIntervalLogic = createLogic({
  type: [STONE_MOVED_DOWN, STONE_PULLED_DOWN, FIELD_STONE_INSERTED, FIELD_OVERFLOW, GAME_PAUSE, GAME_RESET],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();

    if (action.type === GAME_RESET) {
      library.tetris.timeout({clear: true});
      done();
      return;
    }

    if (action.type === FIELD_OVERFLOW) {
      done();
      return;
    }

    if (state.game.paused) {
      done();
      return;
    }

    // dispatch new move-down-loop
    library.tetris.timeout({
      callback: () => dispatch(actions.stone.moveDown()),
      duration: () => library.tetris.settings.calcIntervalSpeed(state.game.level),
      after: () => done(),
    });
  }
});



/**
 * Listen to the main game-state and game-over
 *
 */
export const gameStateLogic = createLogic({
  type: [GAME_START_DELAY, FIELD_OVERFLOW],

  process({ getState, action }, dispatch, done) {

    if (action.type === GAME_START_DELAY) {
      let state = getState();

      dispatch(actions.game.start({
        paused: true,
        multiPlay: (state.multiplay.status === 2),
        level: state.multiplay.level,
      }));

      dispatch(actions.cmp.delayDispatch({
        creator: actions.game.pause,
        delay: action.delay,
      }));
    }

    else if (action.type === FIELD_OVERFLOW) {

      dispatch(actions.game.over());
    }

    done();
  }
});
