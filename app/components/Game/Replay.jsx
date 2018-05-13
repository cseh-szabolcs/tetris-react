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
    const { size, replayGame, isGameOver } = this.props;

    if (!isGameOver) {
      return null;
    }

    return (
      <div className="tetris-game-replay" style={ {top:this.state.top} }>
        <button type="button" className={`alert ${size} button`} onClick={ replayGame }>
          Replay
        </button>
      </div>
    )
  }

}


export default connect(
  (state) => ({
    isGameOver: (state.game.status === false),
  }),
  (dispatch) => ({
    replayGame: () => dispatch(actions.game.init({})),
  })
)(Replay);
