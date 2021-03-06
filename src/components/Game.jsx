import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';
import { Control, Field, Stone, NextStone, Replay, Statistics, AsciiGame } from './Game/index';


export const Game = ({ isGameOver, switchAsciiMode, asciiMode = false, isMasterTab = true }) => {

  return (
    <div>
      { asciiMode && (
        <AsciiGame />
      )}
      { !asciiMode && (
        <div className="tetris-game">
          <Field>
            <Stone />
            { isGameOver && (<Replay />) }
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
          onFocus={ e => e.target.blur() }
        />
        <label className="switch-paddle" htmlFor="asciiMode">
          <span className="show-for-custom">ASCII-Mode</span>
          <span className="switch-active" aria-hidden="true">Yes</span>
          <span className="switch-inactive" aria-hidden="true">No</span>
        </label>
      </div>

      { isMasterTab && (<Control />) }
    </div>
  );
};


export default connect(
  (state) => ({
    isGameOver: (state.game.status !== null),
    asciiMode: state.game.asciiMode,
    isMasterTab: state.window.masterTab,
  }),
  (dispatch) => ({
    switchAsciiMode: () => dispatch(actions.game.switchAsciiMode()),
  }),
)(Game);
