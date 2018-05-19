
import {
  CHAT_OPEN,
  CHAT_MESSAGE_RECEIVED,
  CHAT_MESSAGE_SEND,
  CHAT_WINDOW_CLOSE,
  CHAT_WINDOW_OPEN,
  CHAT_WINDOW_FOCUS,
} from './types';



export const open = ({ recipientUid }) => {
  return {
    type: CHAT_OPEN,
    recipientUid,
  };
};


export const messageReceived = ({ room, otherUid, initial, message = null, alert = null }) => {
  return {
    type: CHAT_MESSAGE_RECEIVED,
    room,
    otherUid: parseInt(otherUid),
    initial,
    message,
    alert,
  };
};


export const messageSend = ({ room, message }) => {
  return {
    type: CHAT_MESSAGE_SEND,
    room,
    message,
  };
};


export const reOpen = ({ room }) => {
  return {
    type: CHAT_WINDOW_OPEN,
    room,
  }
};


export const close = ({ room }) => {
  return {
    type: CHAT_WINDOW_CLOSE,
    room,
  }
};


export const windowFocus = ({ room, focused }) => {
  return {
    type: CHAT_WINDOW_FOCUS,
    room,
    focused,
  }
};
