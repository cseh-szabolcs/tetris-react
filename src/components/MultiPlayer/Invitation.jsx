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
      return (this.props.isInitial)
        ? this.renderInvitationSender()
        : this.renderInvitationRecipient();
  }


  renderInvitationRecipient()
  {
    return (
      <div className="tetris-chat-modal invitation">
        <p>
          You want to play a multi-player-game on <strong>level { this.props.level }</strong>?
        </p>
        <button className="button expanded" onClick={ () => this.handleAccept() }>
          Start game!
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


  handleAccept()
  {
    this.props.confirm();
  }

}


export default connect(
  (state) => ({
    level: state.multiplay.level,
    isInitial: state.multiplay.initial,
  }),
  (dispatch) => ({
    confirm: (room, level) => dispatch(actions.multiplay.confirm()),
  })
)(Invitation);
