
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  STONE_MOVE_DOWN_REJECTED,
  MULTIPLAY_FIELD_CHANGED,
} = actions.types;



/**
 * Check if user managed to solve lines
 *
 */
export const removeLinesLogic = createLogic({
  type: STONE_MOVE_DOWN_REJECTED,
  latest: true,

  process({ getState, action, tetris, timeout }, dispatch, done) {
    let state = getState();
    let result = tetris.removeSolvedLines(state.field);

    // do nothing, when no lines removed
    if (result.field === state.field) {
      dispatch(actions.field.notChanged());
      done();

      return;
    }

    dispatch(actions.field.linesResolved({ lines: result.resolved }));

    // run animation when lines was resolved
    timeout({
      callback: () => dispatch(actions.field.changed({
        newField: result.field,
        lines: result.resolved,
      })),
      duration: state.layout.linesRemoveDuration,
      than: () => done(),
    });
  }
});



/**
 * Add lines to field (only used on multi-play-mode)
 *
 */
export const addLinesLogic = createLogic({
  type: MULTIPLAY_FIELD_CHANGED,
  latest: true,

  process({ getState, action }, dispatch, done) {
    let state = getState();
    const resolverLines = action.resolvedLines;

    if (resolverLines === 0) {
      done(); return;
    }

    dispatch(actions.game.intervalBreak());


    done(); return;
  }
});