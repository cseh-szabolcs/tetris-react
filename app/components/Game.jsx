import React from 'react';
import { connect } from 'react-redux';

import actions from 'tetris-actions';



export const Game = ({  }) => {

  return (
    <div>
      <p>Game component</p>
    </div>
  );
};


export default connect(
  (state) => ({

  }),
  (dispatch) => ({

  }),
)(Game);
