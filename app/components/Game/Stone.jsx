import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';


export const Stone = ({stoneState, nodeKey, isGamePaused = false}) => {

  if (!stoneState.current || isGamePaused) {
    return null;
  }

  let style = {
    left: (stoneState.xPos*32),
    top: (stoneState.yPos*32),
    width: 0,
    height: 0,
  };

  let size = stoneState.current.left[0].length;
  style.width = size * 32;
  style.height = size * 32;

  return (
    <div className={`tetris-stone`} style={ style } key={ nodeKey }>
      <table>
        <tbody>
        { renderRows(stoneState) }
        </tbody>
      </table>
    </div>
  )
};


function renderRows(stoneState) {
  let current = stoneState.current[stoneState.rotation], rows = [], i = 0;
  for (let row of current) {
    rows.push(
      <tr key={`i${++i}`}>
        { renderCols(stoneState.current, row) }
      </tr>
    );
  }
  return rows;
}

function renderCols(stone, row) {
  let cols = [], i = 0;
  for (let col of row) {
    cols.push(
      <td key={`i${++i}`}>
        <Cell value={ (col) ? stone.value : 0 } />
      </td>
    );
  }
  return cols;
}


export default connect(
  (state) => ({
    stoneState: state.stone,
    nodeKey: state.stone.inserted,
    isGamePaused: (state.game.paused || state.game.countDown),
  })
)(Stone);
