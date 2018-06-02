
import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';


export const Welcome = ({ initGame, isMasterTab = true }) => (
  <div className="tetris-welcome">
    <h1>Tetris</h1>
    { isMasterTab && (
      <button className="button large expanded" onClick={ () => initGame() }>
        Start single-player!
      </button>
    )}
    <a href="https://github.com/cseh-szabolcs/tetris-react" target="_blank">
      Source on GitHub &raquo;
    </a>
  </div>
);


export default connect(
  (state) => ({
    isMasterTab: state.window.masterTab,
  }),
  (dispatch) => ({
    initGame: () => dispatch(actions.game.init({})),
  }),
)(Welcome);
