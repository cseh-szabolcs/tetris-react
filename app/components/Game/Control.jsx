import React from 'react';
import Rx from 'rxjs';
import { connect } from 'react-redux';

import actions from 'tetris-actions';


/**
 * Observes all key-key-events to control the game
 *
 */
export class Control extends React.PureComponent
{

  componentWillMount()
  {
    this.supportedKeys = {
      '$ArrowUp': '$rotate',
      '$ArrowLeft': '$moveLeft',
      '$ArrowRight': '$moveRight',
      '$ArrowDown': '$moveDown',
      '$ ': '$pullDown',
      '$c': '$switchAscii',
      '$p': 'handlePause',
    };

    this.avoidRepititionOn = ['$ ', '$c', '$p'];
    this.allowWhenPaused = ['$c'];
    this.current = null;
  }


  componentDidMount()
  {
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur', this.onBlur);


    this.keydown = Rx.Observable.fromEvent(window, 'keydown').map((e) => {
      if (this.props.isRunning) {
        e.preventDefault();
      }
      return e;
    }).pluck('key').subscribe({
      next: (e) => this.handleKeyDown(e)
    });

    this.keyup = Rx.Observable.fromEvent(window, 'keyup').pluck('key').subscribe({
      next: (e) => this.handleKeyUp(e)
    });
  }


  componentWillUnmount()
  {
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('blur', this.onBlur);
    this.keydown.unsubscribe();
    this.keyup.unsubscribe();
  }


  render()
  {
    return (
      <div className="tetris-control">
        { this.renderDescription('right', 'Move to right') }
        { this.renderDescription('left', 'Move to left') }
        { this.renderDescription('down', 'Move down') }
        { this.renderDescription('up', 'Rotate (clockwise)') }
        <br />
        { this.renderDescription('space', 'Pull down') }
        { this.renderDescription('c', 'ASCII-Mode') }
      </div>
    );
  }


  renderDescription(label, descr)
  {
    return (
      <span className="tetris-control-descr">
        <span className="tetris-control-label">
          { label }
        </span>
        <span className="tetris-control-text">
          { descr }
        </span>
      </span>
    );
  }


  handlePause()
  {
    if (this.props.isPaused) {
      this.props.pause(false);

    } else {
      this.props.pause(true);
    }
  }


  /**
   * CORE: game-handling
   *
   */
  handleKeyDown(char)
  {
    if (!this.props.isRunning) {
      return;
    }

    const key = '$'+char;

    if (key in this.supportedKeys) {
      if (this.avoidRepititionOn.indexOf(key) !== -1 && this.current === key) {
        return;
      }

      this.current = key;

      const action = this.supportedKeys[key];

      if (action.indexOf('$') === 0) {
        if (!this.props.isPaused || this.allowWhenPaused.indexOf(key) > -1) {
          this.props[action]();
        }
      } else {
        this[action]();
      }
    }
  };


  /**
   * CORE: game-handling
   *
   */
  handleKeyUp(char)
  {
    const key = '$'+char;

    if (key in this.supportedKeys && this.current === key) {
      this.current = null;
    }
  };


  onFocus = () => {
    if (this.props.isRunning) {
      this.props.pause(false);
    }
  };

  onBlur = () => {
    if (this.props.isRunning) {
      this.props.pause(true);
    }
  };
}


export default connect(
  (state) => ({
    stone: state.stone,
    isRunning: state.game.running,
    isPaused: state.game.paused,
  }),
  (dispatch) => ({
    $rotate: () => dispatch(actions.stone.rotate()),
    $moveLeft: () => dispatch(actions.stone.moveLeft()),
    $moveRight: () => dispatch(actions.stone.moveRight()),
    $moveDown: () => dispatch(actions.stone.moveDown()),
    $pullDown: () => dispatch(actions.stone.pullDown()),
    $switchAscii: () => dispatch(actions.game.switchAsciiMode()),
    pause: () => dispatch(actions.game.pause()),
  })
)(Control);
