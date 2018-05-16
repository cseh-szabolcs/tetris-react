
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  GAME_NEXT,
  STONE_CREATE,
  STONE_MOVE_DOWN,
  STONE_MOVE_LEFT,
  STONE_MOVE_RIGHT,
  STONE_PULL_DOWN,
  STONE_ROTATE,
} = actions.types;


/**
 * Creates an new stone
 *
 */
export const createStoneLogic = createLogic({
  type: [GAME_NEXT],
  latest: true,

  process({ getState, action, tetris }, dispatch, done) {
    let state = getState();

    let nextStone = tetris.getStoneByRandom();

    let currentStone = (state.stone.next)
      ? state.stone.next
      : tetris.getStoneByRandom(nextStone);

    dispatch(actions.stone.create({
      current: currentStone,
      next: nextStone,
    }));

    done();
  }
});


/**
 * Insert new created stone in the field
 *
 */
export const insertLogic = createLogic({
  type: STONE_CREATE,
  latest: true,

  process({ getState, action, tetris }, dispatch, done) {
    let state = getState();

    let newField = tetris.mergeStoneInField(null,
      state.stone,
      state.field,
    );

    if (newField !== state.field) {
      dispatch(actions.stone.inserted({ newField }));
    } else {
      dispatch(actions.stone.insertReject());
    }

    done();
  }
});


/**
 * When the stone is moving down
 *
 */
export const moveDownLogic = createLogic({
  type: STONE_MOVE_DOWN,
  latest: true,

  process({ getState, action, tetris }, dispatch, done) {
    let state = getState();

    let newField = tetris.mergeStoneInField(
      action.type,
      state.stone,
      state.field,
    );

    if (newField !== state.field) {
      dispatch(actions.stone.movedDown({ newField }));
    } else {
      dispatch(actions.stone.moveDownReject());
    }

    done();
  }
});


/**
 * When the stone is pulling down
 *
 */
export const pullDownLogic = createLogic({
  type: STONE_PULL_DOWN,
  latest: true,

  process({ getState, action, tetris }, dispatch, done) {
    let state = getState();

    let result = tetris.stonePullDown(
      state.stone,
      state.field,
    );

    if (result.field !== state.field) {
      dispatch(actions.stone.pulledDown({
        newField: result.field,
        yPos: result.yPos,
      }));
    }

    done();
  }
});


/**
 * When the stone is moving to left or right
 *
 */
export const moveSideLogic = createLogic({
  type: [STONE_MOVE_LEFT, STONE_MOVE_RIGHT],
  latest: true,

  validate({ getState, action, tetris }, allow, reject) {
    let state = getState();

    let newField = tetris.mergeStoneInField(
      action.type,
      state.stone,
      state.field,
    );

    if (newField !== state.field) {
      return allow(action.type === STONE_MOVE_LEFT
        ? actions.stone.movedLeft({ newField })
        : actions.stone.movedRight({ newField })
      );
    }

    reject(action.type === STONE_MOVE_LEFT
      ? actions.stone.moveLeftReject()
      : actions.stone.moveRightReject()
    );
  }
});


/**
 * when rotate an stone
 *
 */
export const rotateLogic = createLogic({
  type: STONE_ROTATE,
  latest: true,

  validate({ getState, action, tetris }, allow, reject) {
    let state = getState();

    if (state.stone.xPos === -1) {
      // reject when stone was positioned on -1
      return reject(actions.stone.rotateReject());
    }

    let newField = tetris.mergeStoneInField(
      action.type,
      state.stone,
      state.field,
    );

    if (newField === state.field) {
      return reject(actions.stone.rotateReject());
    }

    allow(actions.stone.rotated({ newField }));
  }
});
