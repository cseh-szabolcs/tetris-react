
import {
  AUTH_JOIN,
  AUTH_JOINED,
  AUTH_LEAVE,
  AUTH_UID_RECEIVED,
} from './types';


export const uidReceived = ({ uid, onlineUsers, onlineUids = [] }) => {
  for (let uid of Object.keys(onlineUsers)) {
    onlineUids.push(parseInt(uid));
  }

  return {
    type: AUTH_UID_RECEIVED,
    uid,
    onlineUsers,
    onlineUids,
  };
};


export const join = ({ userName }) => {
  return {
    type: AUTH_JOIN,
    userName,
  };
};

export const joined = ({ token, userName }) => {
  return {
    type: AUTH_JOINED,
    token,
    userName,
  };
};

export const leave = () => {
  return {
    type: AUTH_LEAVE,
  };
};
