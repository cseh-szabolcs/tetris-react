import React from 'react';
import { connect } from 'react-redux';
import actions from 'tetris-actions';


export class Replay extends React.PureComponent
{

  state = {
    top: -100,
  };


  componentDidMount()
  {
    window.setTimeout(() => {
      this.setState({
        top: 320
      })
    }, 60);
  }


  render()
  {
    const { gameStatus, replayGame, resetGame } = this.props;

    if (gameStatus === false) {
      return (
        <div className="tetris-game-replay" style={ {top:this.state.top} }>
          <button type="button" className={`alert large button`} onClick={ replayGame }>
            Replay
          </button>
        </div>
      );
    }

    if (gameStatus === true) {
      return (
        <div className="tetris-game-replay" style={ {top:this.state.top} }>
          <button type="button" className={`alert large button`} onClick={ resetGame }>
            Close
          </button>
        </div>
      );
    }

    return null;
  }

}


export default connect(
  (state) => ({
    gameStatus: state.game.status,
  }),
  (dispatch) => ({
    replayGame: () => dispatch(actions.game.init({})),
    resetGame: () => dispatch(actions.game.reset({})),
  })
)(Replay);
