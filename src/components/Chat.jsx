import React from 'react';
import { connect } from 'react-redux';

import { Window } from './Chat';

/**
 * Renders the chat-window-container
 *
 */
export const Chat = ({chats, onlineUsers}) => {

  if (chats.list.length === 0) {
    return null;
  }

  let items = [], chat;

  for (const room of chats.list) {
    chat = chats.chat[room];

    // do nothing, when other open the window but still typing (no real message-send yet)
    if (!chat.display) {
      continue;
    }

    items.push(
      <Window key={ `c${chat.otherUid}` }
        room={ room }
        user={ onlineUsers[chat.otherUid] }
        messages={ chat.messages }
      />
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="tetris-chats">
      { items }
    </div>
  );
};



export default connect(
  (state) => ({
    chats: state.chats,
    onlineUsers: state.socket.online,
  }),
)(Chat);
