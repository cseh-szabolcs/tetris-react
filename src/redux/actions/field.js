
import {
  FIELD_CHANGED,
  FIELD_LINES_RESOLVED,
  FIELD_NOT_CHANGED,
  FIELD_APPLY_NEW,
} from './types';


export const linesResolved = ({ lines }) => {
  return {
    type: FIELD_LINES_RESOLVED,
    lines,
  };
};

export const changed = ({ newField, lines }) => {
  return {
    type: FIELD_CHANGED,
    newField,
    lines,
  };
};

export const notChanged = () => {
  return {
    type: FIELD_NOT_CHANGED,
  };
};


export const applyNewField = ({ newField }) => {
  return {
    type: FIELD_APPLY_NEW,
    newField,
  };
};

