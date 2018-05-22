
import {
  STONE_CREATE,
  STONE_INSERT,
  STONE_INSERTED,
  STONE_INSERT_REJECT,
  STONE_MOVE_DOWN,
  STONE_MOVED_DOWN,
  STONE_MOVE_DOWN_REJECTED,
  STONE_PULL_DOWN,
  STONE_PULLED_DOWN,
  STONE_ROTATE,
  STONE_ROTATED,
  STONE_ROTATE_REJECTED,
  STONE_MOVE_LEFT,
  STONE_MOVED_LEFT,
  STONE_MOVE_LEFT_REJECTED,
  STONE_MOVE_RIGHT,
  STONE_MOVED_RIGHT,
  STONE_MOVE_RIGHT_REJECTED,
  STONE_MOVE_POSITION,
} from './types';



export const create = ({ current, next }) => {
  return {
    type: STONE_CREATE,
    current,
    next,
  };
};


// insert

export const insert = () => {
  return {
    type: STONE_INSERT,
  };
};

export const inserted = ({ newField }) => {
  return {
    type: STONE_INSERTED,
    newField,
  };
};

export const insertReject = () => {
  return {
    type: STONE_INSERT_REJECT,
  };
};


// move down

export const moveDown = () => {
  return {
    type: STONE_MOVE_DOWN,
  };
};

export const movedDown = ({ newField }) => {
  return {
    type: STONE_MOVED_DOWN,
    newField,
  };
};

export const moveDownReject = () => {
  return {
    type: STONE_MOVE_DOWN_REJECTED,
  };
};


// pull down

export const pullDown = () => {
  return {
    type: STONE_PULL_DOWN,
  };
};

export const pulledDown = ({ newField, yPos }) => {
  return {
    type: STONE_PULLED_DOWN,
    newField,
    yPos
  };
};


// rotate

export const rotate = () => {
  return {
    type: STONE_ROTATE,
  };
};

export const rotated = ({ newField }) => {
  return {
    type: STONE_ROTATED,
    newField,
  };
};

export const rotateReject = () => {
  return {
    type: STONE_ROTATE_REJECTED,
  };
};


// move left

export const moveLeft = () => {
  return {
    type: STONE_MOVE_LEFT,
  };
};

export const movedLeft = ({ newField }) => {
  return {
    type: STONE_MOVED_LEFT,
    newField,
  };
};

export const moveLeftReject = () => {
  return {
    type: STONE_MOVE_LEFT_REJECTED,
  };
};


// move right

export const moveRight = () => {
  return {
    type: STONE_MOVE_RIGHT,
  };
};

export const movedRight = ({ newField }) => {
  return {
    type: STONE_MOVED_RIGHT,
    newField,
  };
};

export const moveRightReject = () => {
  return {
    type: STONE_MOVE_RIGHT_REJECTED,
  };
};


// move to position (for multi-play-mode, when lines was added -> move up)

export const moveToPosition = ({ xPos = null, yPos = null }) => {
  return {
    type: STONE_MOVE_POSITION,
    xPos,
    yPos,
  };
};
