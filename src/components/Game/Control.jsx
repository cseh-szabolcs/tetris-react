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
    this.canAlwaysControl = ['$c'];
    this.currentKey = null;
  }


  componentDidMount()
  {
    window.addEventListener('focus', this.onFocus);
    window.addEventListener('blur', this.onBlur);
    this.subscribeKeyboard();
  }


  componentWillUnmount()
  {
    window.removeEventListener('focus', this.onFocus);
    window.removeEventListener('blur', this.onBlur);
    this.unsubscribeKeyboard();
  }


  componentDidUpdate(prevProps)
  {
    if (prevProps.isGameRunning && !this.props.isGameRunning) {
      this.unsubscribeKeyboard();
      return;
    }

    if (!prevProps.isGameRunning && this.props.isGameRunning) {
      this.subscribeKeyboard();
      return;
    }

    if (this.props.isChatWindowFocus) {
      this.props.pause(true);
      this.unsubscribeKeyboard();
      return;
    }

    if (!this.props.isChatWindowFocus && prevProps.isChatWindowFocus) {
      this.props.pause(false);
      this.subscribeKeyboard();
    }
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
        { this.renderDescription('p', 'Pause (single-player only!)') }
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
    this.props.pause(!this.props.isGamePaused);
  }


  /**
   * CORE: game-handling
   *
   */
  handleKeyDown(char)
  {
    const key = '$'+char;

    if (key in this.supportedKeys) {
      if (this.avoidRepititionOn.indexOf(key) !== -1 && this.currentKey === key) {
        return;
      }

      this.currentKey = key;

      const action = this.supportedKeys[key];

      if (action.indexOf('$') === 0) {
        if (this.props.canControl || this.canAlwaysControl.indexOf(key) > -1) {
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

    if (key in this.supportedKeys && this.currentKey === key) {
      this.currentKey = null;
    }
  };


  subscribeKeyboard()
  {
    this.keydown = Rx.Observable.fromEvent(window, 'keydown').map((e) => {
      e.preventDefault();
      return e;
    }).pluck('key').subscribe({
      next: (e) => this.handleKeyDown(e)
    });

    this.keyup = Rx.Observable.fromEvent(window, 'keyup').pluck('key').subscribe({
      next: (e) => this.handleKeyUp(e)
    });
  }


  unsubscribeKeyboard()
  {
    this.keydown.unsubscribe();
    this.keyup.unsubscribe();
  }


  onFocus = () => {
    this.props.pause(false);
  };

  onBlur = () => {
    this.props.pause(true);
  };
}


export default connect(
  (state) => ({
    stone: state.stone,
    isGameRunning: (state.game.running !== false),
    isGamePaused: state.game.paused,
    isChatWindowFocus: (state.chat.focused !== null),
    canControl: (
      state.game.running
      && state.game.paused === false
      && state.game.countDown === 0
      && state.stone.current !== null
    ),
  }),
  (dispatch) => ({
    $rotate: () => dispatch(actions.stone.rotate()),
    $moveLeft: () => dispatch(actions.stone.moveLeft()),
    $moveRight: () => dispatch(actions.stone.moveRight()),
    $moveDown: () => dispatch(actions.stone.moveDown()),
    $pullDown: () => dispatch(actions.stone.pullDown()),
    $switchAscii: () => dispatch(actions.game.switchAsciiMode()),
    pause: (value) => dispatch(actions.game.pause(value)),
  })
)(Control);
