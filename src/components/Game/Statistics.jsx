import React from 'react';
import { connect } from 'react-redux';


export const Statistics = ({level, resolved, score}) => (
  <div className="tetris-statistics">
    <table>
      <tbody>
      { renderTr('level', level) }
      { renderTr('lines', resolved) }
      { renderTr('score', score) }
      </tbody>
    </table>
  </div>
);


function renderTr(label, value) {
  return (
    <tr>
      <td>{ label }</td>
      <td className="text-right">{ value }</td>
    </tr>
  );
}


export default connect(
  (state) => ({
    level: state.game.level,
    resolved: state.game.resolved,
    score: state.game.score,
  })
)(Statistics);
