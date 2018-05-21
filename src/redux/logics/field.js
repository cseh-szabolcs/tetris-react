
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  STONE_MOVE_DOWN_REJECTED,
} = actions.types;



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
      dispatch(actions.field.notChanged());
      done();

      return;
    }

    dispatch(actions.field.linesResolved({ lines: result.resolved }));

    // run animation when lines was resolved
    library.tetris.timeout({
      callback: () => dispatch(actions.field.changed({
        newField: result.field,
        lines: result.resolved,
      })),
      duration: state.layout.linesRemoveDuration,
      than: () => done(),
    });
  }
});
