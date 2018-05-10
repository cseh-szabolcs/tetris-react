
import React from 'react';
import { connect } from 'react-redux';

import Components from 'tetris-components';
const { Game, Welcome } = Components;


/**
 * Shows the game-page
 *
 */
export class GamePage extends React.Component
{
  render() {
    return (
      <Welcome />
    );
  }
}


export default connect(
  (state) => ({

  }),
  (dispatch) => ({

  }),
)(GamePage);
