
import {
  MULTIPLAY_INVITE,
  MULTIPLAY_INVITATION,
  MULTIPLAY_ACCEPT,
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
