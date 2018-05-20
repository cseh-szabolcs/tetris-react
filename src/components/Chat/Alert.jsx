
import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import { Field, Invitation, Invite } from '../MultiPlay/index';


/**
 * Renders an custom-alert-message
 *
 */
export class Alert extends React.PureComponent
{

  state = {
    value: null,
  };

  componentDidUpdate()
  {
    if (!this.props.onValueChanged) {
      return;
    }

    if (this.props.value) {
      this.setState({value: null });
      this.props.onValueChanged(this.props.value);
      return;
    }

    this.props.onValueChanged(this.state.value);
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
    const value = this.props.value;

    if (value === 'multiplay') {
      return (
        <a onClick={ e => this.handleMultiPlayCancel(e) }
           className="button alert"
           href="#">
          Quit
        </a>
      );
    }

    if (value === 'invitation') {
      return (
        <a onClick={ e => this.handleMultiPlayCancel(e) }
           className="button alert"
           href="#">
          Cancel
        </a>
      );
    }

    if (this.state.value === 'invite') {
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
    const value = this.props.value;
    const room = this.props.room;

    if (value === 'multiplay') {
      return (
        <li>
          <Field room={ room } />
        </li>
      );
    }

    if (value === 'invitation') {
      return (
        <li>
          <Invitation room={ room } />
        </li>
      );
    }

    if (value === 'invite') {
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
    this.setState({value: 'invite'});
  }


  handleInviteCancel(e)
  {
    e.preventDefault();
    this.setState({value: null});
  }


  handleMultiPlayCancel(e)
  {
    e.preventDefault();
    this.props.cancelMultiPlay(this.props.room);
  }
}



export default connect(null,
  (dispatch) => ({
    invite: (room, level) => dispatch(actions.multiplay.invite({ room, level })),
    cancelMultiPlay: room => dispatch(actions.multiplay.cancel({ room })),
  })
)(Alert);
