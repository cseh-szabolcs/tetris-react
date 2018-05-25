
import {
  ONLINE_JOIN,
  ONLINE_LEAVE,
  ONLINE_RELATION,
  ONLINE_STATUS_CHANGED,
} from './types';



export const join = ({ uid, userName, status }) => {
  return {
    type: ONLINE_JOIN,
    uid: parseInt(uid),
    userName,
    status,
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

export const changeStatus = ({ uids, status }) => {
  return {
    type: ONLINE_STATUS_CHANGED,
    uids,
    status: parseInt(status),
  };
};
