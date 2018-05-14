
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
      <div>
        { !this.props.isMasterTab && (
          <div className="callout warning text-center">
            <strong>It seems you playing Tetris in another tab or window already!</strong>
          </div>
        )}
        { !this.props.isInited && (
          <Welcome />
        )}
        { this.props.isInited && (
          <Game />
        )}
      </div>
    );
  }
}


export default connect(
  (state) => ({
    isMasterTab: state.window.masterTab,
    isInited: state.game.init,
  }),
)(GamePage);
