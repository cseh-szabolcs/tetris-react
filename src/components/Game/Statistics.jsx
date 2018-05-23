import React from 'react';
import { connect } from 'react-redux';


export const Statistics = ({level, resolved, score, isMultiplay = false}) => (
  <div className="tetris-statistics">
    <table>
      <tbody>
      <tr>
        <td colSpan={2}>
          { !isMultiplay && (
            <p className="small">
              Single-player
            </p>
          )}
          { isMultiplay && (
            <p className="small">
              Two-player
            </p>
          )}
        </td>
      </tr>
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
    isMultiplay: state.game.multiplay,
  })
)(Statistics);
