import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';


/**
 * Renders the invitation-message and handles the confirmation for
 * the multi-player-mode.
 *
 */
export class Invitation extends React.PureComponent
{

  render()
  {
    if (!this.props.invitations[this.props.room]) {
      return null;
    }

    const invitation = this.props.invitations[this.props.room];

      return (invitation.initial)
        ? this.renderInvitationSender()
        : this.renderInvitationRecipient(invitation);
  }


  renderInvitationRecipient(invitation)
  {
    return (
      <div className="tetris-chat-modal invitation">
        <p>
          You want to play a multi-player-game on <strong>level { invitation.level }</strong>?
        </p>
        <button className="button expanded" onClick={ () => this.handleAccept(invitation.room) }>
          Start two-player!
        </button>
      </div>
    );
  }


  renderInvitationSender()
  {
    return(
      <div className="tetris-chat-modal invitation">
        <p>
          Your request is send, waiting for confirmation...
        </p>
      </div>
    );
  }


  handleAccept(room)
  {
    this.props.accept(room);
  }
}



export default connect(
  (state) => ({
    invitations: state.multiplay.invitations,
  }),
  (dispatch) => ({
    accept: room => dispatch(actions.multiplay.accept({ room })),
  })
)(Invitation);
