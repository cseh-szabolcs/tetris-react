import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import { Field, Invitation, Invite } from '../MultiPlayer/index';
import jQuery from "jquery";


/**
 * Renders an custom-alert-message
 *
 */
export class Alert extends React.PureComponent
{

  render()
  {
    if (this.props.render === 'multiPlayActions') {
      return this.renderActionButtons();
    }
    return this.renderContent();
  }


  renderActionButtons()
  {
    if (this.props.isMultiPlay || this.props.isInvitation) {
      return (
        <a onClick={ () => this.handleQuit() }
           className="button alert"
           href="#">
          { this.props.isMultiPlay ? 'Quit' : 'Cancel' }
        </a>
      );
    }

    if (this.props.action === 'inviteUser') {
      return (
        <a onClick={ () => this.handleInvitationCancel() }
           className="button alert"
           href="#">
          Cancel
        </a>
      );
    }

    return (
      <a onClick={ () => this.handleInvite() }
         className="button warning"
         href="#"
         title="click here to play in two-player-mode!">
        Invite to Play!
      </a>
    );
  }


  renderContent()
  {
    if (this.props.isMultiPlay) {
      return (
        <li>
          <Field />
        </li>
      );
    }

    if (this.props.isInvitation) {
      return (
        <li>
          <Invitation />
        </li>
      );
    }

    if (this.props.action === 'inviteUser') {
      return (
        <li>
          <Invite room={this.props.room} />
        </li>
      );
    }

    return null;
  }


  handleInvite()
  {
    this.props.onAction("inviteUser")
  }

  handleInvitationCancel()
  {
    this.props.onAction(null)
  }

  handleQuit()
  {
    this.props.quitMultiPlay();
  }

}



export default connect(
  (state) => ({
    isInvitation: false, // (state.multiplay.status === 1),
    isMultiPlay: false, // (state.multiplay.status === 2),
  }),
  (dispatch) => ({
    invite: (room, level) => dispatch(actions.multiplay.invite({ room, level })),
    quitMultiPlay: () => dispatch(actions.multiplay.quit()),
  })
)(Alert);
