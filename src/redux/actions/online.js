
import {
  ONLINE_JOIN,
  ONLINE_LEAVE,
  ONLINE_RELATION,
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

export const setRelation = ({ uid, relation, room }) => {
  return {
    type: ONLINE_RELATION,
    uid: uid,
    relation,
    room,
  };
};
