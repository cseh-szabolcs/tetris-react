
import {
  AUTH_JOIN,
  AUTH_JOINED,
  AUTH_LEAVE,
} from './types';


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
