import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';


/**
 * Renders an chat-message to invite an another player
 *
 */
export class Invite extends React.PureComponent
{
  static LEVEL_MIN = 1;
  static LEVEL_MAX = 9;


  constructor(props) {
    super(props);

    this.state = {
      level: 1,
      strict: true,
    };
  }


  render()
  {
    return (
      <div className="tetris-chat-modal invite">
        <h6 className="subheader">Select level:</h6>
        <h2>
          { this.state.level }
        </h2>
        <div className="select-level">
          <button
            className="button hollow"
            onClick={ () => this.decreaseLevel() }
            disabled={ (this.state.level === Invite.LEVEL_MIN) }>
            -
          </button>
          <button
            className="button hollow"
            onClick={ () => this.increaseLevel() }
            disabled={ (this.state.level === Invite.LEVEL_MAX) }>
            +
          </button>
        </div>
        <button
          className="button block full"
          onClick={ () => this.invite() }>
          Invite to play
        </button>
        <label>
          <input
            className="blur"
            type="checkbox"
            checked={ this.state.strict }
            onChange={ () => this.changeMode() }
          /> Strict mode
        </label>
      </div>
    );
  }


  invite()
  {
    this.props.invite(
      this.props.room,
      this.state.level,
      this.state.strict
    );
  }


  decreaseLevel()
  {
    if (this.state.level > Invite.LEVEL_MIN) {
      this.setState({
        level: this.state.level-1
      });
    }
  }

  increaseLevel()
  {
    if (this.state.level < Invite.LEVEL_MAX) {
      this.setState({
        level: this.state.level+1
      });
    }
  }

  changeMode()
  {
    this.setState({strict: !this.state.strict});
  }
}


export default connect(
  (state) => ({

  }),
  (dispatch) => ({
    invite: (room, level, strict) => dispatch(actions.multiplay.invite({ room, level, strict })),
  })
)(Invite);
