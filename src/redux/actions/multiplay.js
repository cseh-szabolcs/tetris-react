
import {
  MULTIPLAY_ACCEPT,
  MULTIPLAY_CANCEL,
  MULTIPLAY_CANCELED,
  MULTIPLAY_INVITE,
  MULTIPLAY_INVITATION,
  MULTIPLAY_START,
} from './types';



export const invite = ({ room, level, strict }) => {
  return {
    type: MULTIPLAY_INVITE,
    room,
    level,
    strict,
  };
};

export const invitation = ({ room, otherUid, level, strict, initial }) => {
  return {
    type: MULTIPLAY_INVITATION,
    room,
    otherUid: parseInt(otherUid),
    level: parseInt(level),
    strict,
    initial,
  };
};



export const accept = ({ room }) => {
  return {
    type: MULTIPLAY_ACCEPT,
    room,
  };
};

export const start = ({ room }) => {
  return {
    type: MULTIPLAY_START,
    room,
  };
};



export const cancel = ({ room }) => {
  return {
    type: MULTIPLAY_CANCEL,
    room,
  };
};

export const canceled = ({ room }) => {
  return {
    type: MULTIPLAY_CANCELED,
    room,
  };
};
