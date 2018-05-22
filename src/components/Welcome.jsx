
import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';


export const Welcome = ({ initGame }) => (
  <div className="tetris-welcome">
    <h1>Tetris</h1>
    <button className="button large expanded" onClick={ () => initGame() }>
      Start single-player!
    </button>
  </div>
);


export default connect(null,
  (dispatch) => ({
    initGame: () => dispatch(actions.game.init({})),
  }),
)(Welcome);
