
import React from 'react';
import { connect } from 'react-redux';

import { Chat, Game, MultiPlay, Welcome } from 'tetris-components';



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

            { this.props.isPingFailed && (
              <strong>
                &nbsp;
                <a onClick={ e => this.handleClickHideMessage(e) }>Click here</a> to hide this message.
              </strong>
            )}
          </div>
        )}

        { !this.props.isInited && (
          <Welcome />
        )}
        { this.props.isInited && (
          <Game />
        )}
        <MultiPlay />
        <Chat />
      </div>
    );
  }

  handleClickHideMessage(e) {
    e.preventDefault();

    window.localStorage.clear();
    location.reload();
  }
}


export default connect(
  (state) => ({
    isMasterTab: state.window.masterTab,
    isPingFailed: state.window.pingFailed,
    isInited: state.game.init,
  }),
)(GamePage);
