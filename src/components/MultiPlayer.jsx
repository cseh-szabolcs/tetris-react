
import React from 'react';
import { connect } from 'react-redux';

import { Auth, UserItem } from './MultiPlayer/index';


/**
 * Renders the multi-player-panel
 *
 */
const MultiPlayer = ({ isSocketError, onlineUsers, onlineList, isMasterTab = true }) => {

  if (isSocketError) {
    return (
      <div className="callout warning">
        Your browser doesn't support web-socket, <strong>no multi-game for you!</strong> <i>:-p</i>
      </div>
    );
  }

  return (
    <div className={ `tetris-multi-player${isMasterTab ? '' : ' disabled'}` }>
      { !isMasterTab && (
        <div className="disabled-layer" />
      )}

      <Auth />

      <div>
        { (onlineList.length > 0) && (
          <p className="title">
            currently online
          </p>
        )}
        <ul className="vertical menu align-left">
          { renderOnlineUsers({ onlineUsers, onlineList }) }
        </ul>
      </div>
    </div>
  );
};


function renderOnlineUsers({ onlineUsers, onlineList }) {

  if (onlineList.length === 0) {
    return (
      <li><i>currently nobody online</i></li>
    );
  }
  let list = [], user;

  for (let uid of onlineList) {
    user = onlineUsers[uid];

    if (user) {
      list.push(
        <UserItem key={ `u${uid}` } userName={ user.userName } uid={ user.uid } />
      );
    }
  }

  return list;
}


export default connect(
  (state) => ({
    onlineUsers: state.online.users,
    onlineList: state.online.list,
    isSocketError: state.auth.error,
    isMasterTab: state.window.masterTab,
  })
)(MultiPlayer);
