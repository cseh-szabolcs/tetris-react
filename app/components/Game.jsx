import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import GameComponents from './Game/index';
const { Control, Field, Stone, NextStone, Replay, Statistics, AsciiGame } = GameComponents;


export const Game = ({ switchAsciiMode, asciiMode = false }) => {

  return (
    <div>
      { asciiMode && (
        <AsciiGame />
      )}
      { !asciiMode && (
        <div className="tetris-game">
          <Field>
            <Stone />
            <Replay />
          </Field>
          <NextStone />
          <Statistics />
        </div>
      )}

      <div className="switch left">
        <input
          className="switch-input"
          id="asciiMode"
          type="checkbox"
          name="exampleSwitch"
          checked={ asciiMode }
          onChange={ switchAsciiMode }
        />
        <label className="switch-paddle" htmlFor="asciiMode">
          <span className="show-for-custom">ASCII-Mode</span>
          <span className="switch-active" aria-hidden="true">Yes</span>
          <span className="switch-inactive" aria-hidden="true">No</span>
        </label>
      </div>
    </div>
  );
};


export default connect(
  (state) => ({
    asciiMode: state.game.asciiMode,
  }),
  (dispatch) => ({
    switchAsciiMode: () => dispatch(actions.game.switchAsciiMode()),
  }),
)(Game);
