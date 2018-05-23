import React from 'react';
import { connect } from 'react-redux';

import Replay from './Replay';


/**
 * Renders the game in ascii-mode
 *
 */
export class AsciiGame extends React.PureComponent
{

  render()
  {
    let content = (this.props.alert)
      ? this.renderText(this.props.alert)
      : this.renderField();

    return(
      <div className="tetris-ascii">
        { this.renderWrapper(content, 18, 21, 'field') }
        { this.renderWrapper(this.renderNextStone(), 18, 6, 'next') }
        { this.renderStatistics() }
      </div>
    );
  }


  renderNextStone()
  {
    if (!this.props.nextStone) {
      return null;
    }

    const nextStone = this.renderField(
      this.props.nextStone.left,
      false,
      this.props.nextStone.value
    );

    return (
      <div>
        <p className="padding-1">
          next
        </p>
        { nextStone }
      </div>
    );
  }


  renderStatistics()
  {
    return (
      <div className="tetris-ascii-statistics">
        <table>
          <tbody>
          <tr>
            <td colSpan={2}>
              { !this.props.isMultiplay && (
                <p className="small">
                  single-player
                </p>
              )}
              { this.props.isMultiplay && (
                <p className="small">
                  two-player
                </p>
              )}
            </td>
          </tr>
          <tr>
            <td>level</td>
            <td className="text-right">{ this.props.level }</td>
          </tr>
          <tr>
            <td>lines</td>
            <td className="text-right">{ this.props.resolved }</td>
          </tr>
          <tr>
            <td>score</td>
            <td className="text-right">{ this.props.score }</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }


  renderField(field = this.props.fieldState, renderEmptyRow = true, value = null)
  {
    let rows = [], cols, vals, val, row, col, blink;

    for (row = 0; row < field.length; row++) {
      cols = [], vals = 0;

      let blink = (field === this.props.fieldState
        && this.props.lastResolvedLines.length > 0
        && this.props.lastResolvedLines.indexOf(row) > -1
      );

      for (col = 0; col < field[row].length; col++) {
        val = (value && field[row][col] !== 0) ? value : field[row][col];
        vals += val;

        cols.push(
          <td key={`c${col}`}>{ (val === 0) ? '\u00A0' : this.getCellChar(val, blink) }</td>
        );
      }

      if (renderEmptyRow || vals > 0) {
        rows.push(
          <tr key={`c${row}`}>{ cols }</tr>
        );
      }
    }

    return (
      <table className="tetris-ascii-field">
        <tbody>
          { rows }
        </tbody>
      </table>
    );
  }


  renderWrapper(body, cols, rows, className)
  {
    let arrCol = [];
    for (let c=0; c<cols; c++) {
      arrCol.push(<span key={`c${c}`} className="tetris-ascii-cell">═</span>);
    }

    let arrRow = [];
    for (let r=0; r<rows; r++) {
      arrRow.push(<span key={`r${r}`} className="tetris-ascii-row">║</span>);
    }

    return (
      <div className={`tetris-ascii-wrapper _${className}`}>
        { (className === 'field' && this.props.isGameOver) && (
          <Replay size="basic" />
        )}
        <table>
          <tbody>
            <tr>
              <td>
                <span className="tetris-ascii-cell">╔</span>
              </td>
              <td>{ arrCol }</td>
              <td>
                <span className="tetris-ascii-cell">╗</span>
              </td>
            </tr>
            <tr>
              <td>{ arrRow }</td>
              <td>{ body }</td>
              <td>{ arrRow }</td>
            </tr>
            <tr>
              <td>
                <span className="tetris-ascii-cell">╚</span>
              </td>
              <td>{ arrCol }</td>
              <td>
                <span className="tetris-ascii-cell">╝</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  getCellChar(value, blink = false)
  {
    const chars = ['o','x','c','n','u','a','e', '#', '�', '❤'];
    value = Math.abs(value);

    let char = (chars.indexOf(--value))
      ? chars[value]
      : chars[0];

    return (
      <span className={ blink ? 'blink' : '' }>
        { char }
      </span>
    );
  }


  renderText(text)
  {
    let fieldState = this.props.fieldState;

    return (
      <table>
        <tbody>
        <tr>
          <td>
            <div className="tetris-ascii-field-text" style={ {width:(fieldState[0].length*26), height:(fieldState.length*25)} }>
              <span>
                { text }
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}



export default connect(
  (state) => ({
    fieldState: state.field,
    nextStone: state.stone.next,
    isGameOver: (state.game.status !== null),
    isMultiplay: state.game.multiplay,
    alert: state.layout.alert,
    lastResolvedLines: state.layout.lastResolvedLines,
    level: state.game.level,
    resolved: state.game.resolved,
    score: state.game.score,
  }),
)(AsciiGame);
