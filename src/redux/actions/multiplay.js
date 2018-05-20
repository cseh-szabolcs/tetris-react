
import {
  MULTIPLAY_INVITE,
} from './types';


export const invite = ({ room, level, strict }) => {
  return {
    type: MULTIPLAY_INVITE,
    room,
    level,
    strict,
  };
};

