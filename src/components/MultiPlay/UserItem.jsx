
import React from 'react';
import { connect } from 'react-redux';
import actions from 'tetris-actions';


/**
 * Renders an single user-item for the user-list
 *
 */
class UserItem extends React.PureComponent
{

  render()
  {
    const { user } = this.props;

    return (
      <li title={ this.renderAttr('title') } onClick={ e => this.handleClick(e) }>
        <a href="#">
          { user.userName } <span className={ this.renderAttr('className') } />
        </a>
      </li>
    );
  }


  handleClick(e)
  {
    e.preventDefault();
    const { user, authUid, isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return;
    }

    if (authUid === user.uid) {
      return;
    }

    if (user.status === 2) {
      return;
    }

    this.props.openChat(user.uid);
  }


  renderAttr(type)
  {
    const { user, authUid, isAuthenticated } = this.props;

    if (user.uid === authUid) {
      return (type === 'title')
        ? 'this is you, don\'t play with yourself :-p'
        : 'owner';
    }

    if (user.status === 2) {
      return (type === 'title')
        ? 'this user is already playing a game'
        : 'busy';
    }

    if (!isAuthenticated) {
      return (type === 'title')
        ? 'If you join, you can play a multi-player game'
        : ((user.status === 2) ? 'busy' : 'available');
    }

    return (type === 'title')
      ? 'click to ask for a multi-player game'
      : 'available';
  }
}



export default connect(
  (state) => ({
    authUid: state.auth.uid,
    isAuthenticated: (state.auth.token !== null),
  }),
  (dispatch) => ({
    openChat: uid => dispatch(actions.chat.open({ recipientUid: uid })),
  })
)(UserItem);
