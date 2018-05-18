
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
    const {userName, uid } = this.props;

    const own = (uid === this.props.authUid);
    const title = own
      ? 'this is you'
      : 'click to ask for a multi-player-game';

    return (
      <li title={ title } onClick={ e => this.handleClick(e) }>
        <a href="#">
          { userName } <span className={ own ? 'owner' : '' } />
        </a>
      </li>
    );
  }


  handleClick(e)
  {
    e.preventDefault();

    if (this.props.authUid !== this.props.uid) {
      this.props.openChat(this.props.uid);
    }
  }
}



export default connect(
  (state) => ({
    authUid: state.auth.uid,
  }),
  (dispatch) => ({
    openChat: uid => dispatch(actions.chats.open(uid))
  })
)(UserItem);
