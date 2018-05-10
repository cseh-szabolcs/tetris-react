import React from 'react';
import { connect } from 'react-redux';


/**
 * Shows the game-page
 *
 */
export class GamePage extends React.Component
{
  render() {
    return (
      <div>
       <p>Tetris is here</p>
      </div>
    );
  }
}


export default connect(
  (state) => ({

  }),
  (dispatch) => ({

  }),
)(GamePage);
