
import React from 'react';
import { connect } from 'react-redux';
import actions from 'tetris-actions';


/**
 * Shows the login-form or the current user and handles the login-/logout-actions
 *
 */
export class Auth extends React.PureComponent
{

  state = {
    userName: ''
  };


  render()
  {
    const { userName, canLogin } = this.props;

    return (
      <React.Fragment>
        { !userName && (
          <div className="tetris-multi-player-join">
            <label className="title">play with others?
              <input
                type="text"
                value={ this.state.userName }
                onChange={ e => this.setState({userName: e.target.value}) }
                placeholder="type your name"
                disabled={ !canLogin }
              />
            </label>
            <button onClick={ () => this.handleJoin() } className="button expanded tiny" href="#">
              join!
            </button>
          </div>
        )}
        { userName && (
          <div className="tetris-multi-player-join">
            <p className="title">
              online as <strong>{userName}</strong>
            </p>
            <button onClick={ () => this.handleLeave() } className="button hollow expanded tiny" href="#">
              leave
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }


  handleJoin(userName = this.state.userName)
  {
    userName = userName.replace(/[^0-9a-zßöäü]/gi, '');

    if (userName !== '') {
      this.props.joinPlayer(userName);
    }
  }

  handleLeave()
  {
    this.props.leavePlayer();
  }
}


export default connect(
  (state) => ({
    uid: state.auth.uid,
    userName: state.auth.userName,
    canLogin: (state.game.paused || (!state.game.running && state.game.countDown === 0)),
  }),
  (dispatch) => ({
    joinPlayer: userName => dispatch(actions.auth.join({ userName })),
    leavePlayer: () => dispatch(actions.auth.leave()),
  })
)(Auth);
