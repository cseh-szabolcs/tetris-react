import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import MultiPlayerComponents from '../MultiPlayer/index';

const { Field, Invitation, Invite } = MultiPlayerComponents;


/**
 * Renders an custom-modal-message
 *
 */
export class Modal extends React.PureComponent
{

  render()
  {
    let content;

    if (this.props.isMultiPlay) {
      content = this.renderMultiPlay();
    } else if (this.props.isInvitation) {
      content = this.renderInvitation();
    } else {
      content = this.renderInvite();
    }

    return (
      <li>{ content }</li>
    );
  }


  renderMultiPlay()
  {
    return (<Field />);
  }

  renderInvitation()
  {
    return (<Invitation />);
  }

  renderInvite()
  {
    return (<Invite room={ this.props.room } />);
  }
}


export default connect(
  (state) => ({
    isInvitation: (state.multiplay.status === 1),
    isMultiPlay: (state.multiplay.status === 2),
  }),
  (dispatch) => ({
    invite: (room, level) => dispatch(actions.multiplay.invite({ room, level })),
  })
)(Modal);
