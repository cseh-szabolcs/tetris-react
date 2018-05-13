
import {
  FIELD_CHANGED,
  FIELD_LINES_RESOLVED,
  FIELD_NOT_CHANGED,
} from './types';


export const linesResolved = ({ lines }) => {
  return {
    type: FIELD_LINES_RESOLVED,
    lines,
  };
};

export const changed = ({ newField }) => {
  return {
    type: FIELD_CHANGED,
    newField,
  };
};

export const notChanged = () => {
  return {
    type: FIELD_NOT_CHANGED,
  };
};
