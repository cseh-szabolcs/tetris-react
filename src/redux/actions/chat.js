
import {
  ONLINE_JOIN,
  ONLINE_LEAVE,
} from './types';



export const join = ({ uid, userName }) => {
  return {
    type: ONLINE_JOIN,
    uid: parseInt(uid),
    userName,
  };
};

export const leave = ({ uid }) => {
  return {
    type: ONLINE_LEAVE,
    uid: parseInt(uid),
  };
};
