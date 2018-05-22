
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

    let result = tetris.removeSolvedLines(state.field, {
      notRemovableValue: 10,
    });

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
      then: () => done(),
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

  process({ getState, action, timeout, tetris, ws }, dispatch, done) {
    let state = getState();
    const resolvedLines = action.resolvedLines;

    if (resolvedLines === 0) {
      done(); return;
    }

    let newLines = 1, emptyCols = 2, value = 9;
    switch (resolvedLines) {
      case 4:
        newLines = 1;
        emptyCols = 0;
        value = 10;
        break;
      case 3:
        newLines = 2;
        emptyCols = 3;
        break;
      case 2:
        emptyCols = 3;
        break;
      default:
        break;
    }

    // CORE: create new lines
    timeout({
      then: () => {
        let newField = tetris.addBadLines(state.field, {
          newLines,
          emptyCols,
          value,
        });

        // game over when its not possible
        if (newField === state.field) {
          done(); return;
        }

        dispatch(actions.field.applyNewField({ newField }));
        done();
      }
    });
  }
});