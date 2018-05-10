import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';

const {
  FIELD_LINES_NOT_CHANGED,
  FIELD_LINES_REMOVED,
  GAME_START,
  STONE_MOVE_DOWN_REJECTED,
} = actions.types;



/**
 * Inserts an new stone in the field
 *
 */
export const insertStoneLogic = createLogic({
  type: [GAME_START, FIELD_LINES_NOT_CHANGED, FIELD_LINES_REMOVED],
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();
    let stone = library.tetris.getStoneByRandom();

    dispatch(actions.stone.create({
      next: stone,
      current: (!state.stone.next)
        ? library.tetris.getStoneByRandom(stone)
        : state.stone.next
    }));

    state = getState();

    let fieldState = library.tetris.mergeStoneInField(null,
      state.stone,
      state.field,
    );

    if (fieldState !== state.field) {
      dispatch(actions.field.insertStone(fieldState));
    } else {
      // game-over
      dispatch(actions.field.overflow());
    }

    done();
  }
});


/**
 * Check if user managed to solve lines
 *
 */
export const removeLinesLogic = createLogic({
  type: STONE_MOVE_DOWN_REJECTED,
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();
    let result = library.tetris.removeSolvedLines(state.field);

    // do nothing, when no lines removed
    if (result.field === state.field) {
      dispatch(actions.field.linesNoChange());
      done();
      return;
    }

    // run animation when lines was resolved
    library.tetris.timeout({
      immediately: () => dispatch(actions.field.linesResolved(result.resolved)),
      callback: () => dispatch(actions.field.linesRemove(result.field)),
      after: () => done(),
      duration: state.cmp.fadeOutLinesSpeed,
    });
  }
});
