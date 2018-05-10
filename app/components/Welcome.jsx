
import React from 'react';
import { connect } from 'react-redux';
import actions from 'tetris-actions';


export const Welcome = ({startGame}) => (
  <div className="tetris-welcome">
    <h1>Tetris</h1>
    <button className="button large expanded" onClick={ () => startGame() }>
      Play now!
    </button>
  </div>
);


export default connect(null,
  (dispatch) => ({
    startGame: () => dispatch(actions.game.start(3)),
  }),
)(Welcome);
