import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';


export const NextStone = ({nextStone}) => {

  if (!nextStone) {
    return null;
  }

  return (
    <div className="tetris-next-stone">
      <div className="position-relative">
        <p>next</p>
        <div className="tetris-stone">
          <table>
            <tbody>
            { renderRows(nextStone.left, nextStone) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


function renderRows(field, nextStone) {
  let rows = [], i = 0;
  for (let row of field) {
    if (row.indexOf(1) === -1) {
      continue;
    }

    rows.push(
      <tr key={`i${++i}`}>
        { renderCols(row, nextStone) }
      </tr>
    );
  }
  return rows;
}


function renderCols(row, nextStone) {
  let cols = [], i = 0, value;
  for (let col of row) {
    value = (col) ? nextStone.value : 0;

    cols.push(
      <td key={ `i${++i}` }>
        <Cell value={ value } />
      </td>
    );
  }
  return cols;
}


export default connect(
  (state) => ({
    nextStone: state.stone.next,
  })
)(NextStone);
