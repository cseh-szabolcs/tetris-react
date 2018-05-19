import React from 'react';
import { connect } from 'react-redux';

import { Window } from './Chat/index';

/**
 * Renders the chat-window-container
 *
 */
export const Chat = ({chat, onlineUsers}) => {

  if (chat.list.length === 0) {
    return null;
  }

  let items = [], window;

  // collect chat-windows
  for (const room of chat.list) {
    window = chat.window[room];

    // do nothing, when other open the window but still typing (no real message-send yet)
    if (!window.display) {
      continue;
    }

    items.push(
      <Window key={ `c${window.otherUid}` }
        room={ room }
        user={ onlineUsers[window.otherUid] }
        messages={ window.messages }
      />
    );
  }

  // are windows to display?
  if (items.length === 0) {
    return null;
  }

  // CORE
  return (
    <div className="tetris-chat">
      { items }
    </div>
  );
};



export default connect(
  (state) => ({
    chat: state.chat,
    onlineUsers: state.online.users,
  }),
)(Chat);
