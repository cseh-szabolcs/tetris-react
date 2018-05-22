import React from 'react';
import { connect } from 'react-redux';
import actions from 'tetris-actions';


export class Replay extends React.PureComponent
{

  static defaultProps = {
    size: 'large'
  };

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
    const { gameStatus, isMultiplay, size, replayGame, resetGame, toSingleGame } = this.props;

    if (!isMultiplay) {
      return (
        <div className="tetris-game-replay" style={ {top:this.state.top} }>
          <button type="button" className={`button alert ${size}`} onClick={ replayGame }>
            Replay
          </button>
        </div>
      );
    }

    else if (isMultiplay) {
      return (
        <div className="tetris-game-replay" style={ {top:this.state.top} }>
          { gameStatus === true && (
            <div>
              <button type="button" className={`button ${size}`} onClick={ toSingleGame }>
                Continue as<br />
                single-player
              </button>
            </div>
          )}
          <button type="button" className={`button alert ${size}`} onClick={ resetGame }>
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
    isMultiplay: state.game.multiplay,
  }),
  (dispatch) => ({
    replayGame: () => dispatch(actions.game.init({})),
    resetGame: () => dispatch(actions.game.reset({})),
    toSingleGame: () => dispatch(actions.game.toSingleMode()),
  })
)(Replay);
