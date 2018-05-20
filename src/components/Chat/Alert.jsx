
import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import { Field, Invitation, Invite } from '../MultiPlay/index';
import jQuery from "jquery";


/**
 * Renders an custom-alert-message
 *
 */
export class Alert extends React.PureComponent
{

  componentDidUpdate(prevProps) {
    if (!this.props.onAction) {
      return;
    }

    if (this.props.action !== null && this.props.action !== 'invite') {
      this.props.onAction(null); // release static-alert value when its changed
    }
  }

  render()
  {
    if (this.props.render === 'actionButtons') {
      return this.renderActionButtons();
    }
    return this.renderContent();
  }


  renderActionButtons()
  {
    const action = this.props.action;

    if (action === 'multiplay') {
      return (
        <a onClick={ e => this.handleMultiPlayCancel(e) }
           className="button alert"
           href="#">
          Quit
        </a>
      );
    }

    if (action === 'invitation') {
      return (
        <a onClick={ e => this.handleMultiPlayCancel(e) }
           className="button alert"
           href="#">
          Cancel
        </a>
      );
    }

    if (action === 'invite') {
      return (
        <a onClick={ e => this.handleInviteCancel(e) }
           className="button alert"
           href="#">
          Cancel
        </a>
      );
    }

    return (
      <a onClick={ e => this.handleInvite(e) }
         className="button warning"
         href="#"
         title="click here to play in two-player-mode!">
        Invite to Play!
      </a>
    );
  }


  renderContent()
  {
    const action = this.props.action;
    const room = this.props.room;

    if (action === 'multiplay') {
      return (
        <li>
          <Field room={ room } />
        </li>
      );
    }

    if (action === 'invitation') {
      return (
        <li>
          <Invitation room={ room } />
        </li>
      );
    }

    if (action === 'invite') {
      return (
        <li>
          <Invite room={ room } />
        </li>
      );
    }

    return null;
  }


  handleInvite(e)
  {
    e.preventDefault();
    this.props.onAction('invite');
  }


  handleInviteCancel(e)
  {
    e.preventDefault();
    this.props.onAction(null);
  }


  handleMultiPlayCancel(e)
  {
    e.preventDefault();
    this.props.onAction(null);
    this.props.cancelMultiPlay(this.props.room);
  }
}



export default connect(null,
  (dispatch) => ({
    invite: (room, level) => dispatch(actions.multiplay.invite({ room, level })),
    cancelMultiPlay: room => dispatch(actions.multiplay.cancel({ room })),
  })
)(Alert);
