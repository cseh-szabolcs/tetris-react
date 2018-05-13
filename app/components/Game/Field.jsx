import React from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';


/**
 * Renders the field
 *
 */
export class Field extends React.PureComponent
{

  render()
  {
    let content = null;

    if (false) {
      content = this.renderText("Hallo Peter", 'timer');
    }
    if (false) {
      content = this.renderText("TESTTEST");
    }

    content = this.renderRows();

    return (
      <div className="tetris-field">
        <div className={`tetris-field-panel _bg${this.props.randomBg}`}>
          { this.props.children }
          <table>
            <tbody>
              { content }
            </tbody>
          </table>
        </div>
      </div>
    );
  }



  renderRows()
  {
    const { fieldState, lastResolvedLines } = this.props;
    let rows = [], i = 0;

    for (let row of fieldState) {

      let fadeOut = (lastResolvedLines.length > 0
        && lastResolvedLines.indexOf(i) > -1
      );

      rows.push(
        <tr key={`i${++i}`}>
          { this.renderCols(row, fadeOut) }
        </tr>
      );
    }
    return rows;
  }


  renderCols(row, fadeOut)
  {
    let cols = [], i = 0;
    for (let col of row) {

      cols.push(
        <td key={ `i${++i}` }>
          <Cell value={ col } fadeOut={ fadeOut } />
        </td>
      );
    }
    return cols;
  }


  renderText(text, className = 'default')
  {
    const { fieldState } = this.props;

    return (
      <tr>
        <td>
          <div className="tetris-field-text" style={ {width:(fieldState[0].length*32), height:(fieldState.length*32)} }>
          <span className={ `tetris-field-text-${className}` }>
            { text }
          </span>
          </div>
        </td>
      </tr>
    );
  }

}



export default connect(
  (state) => ({
    fieldState: state.field,
    isGamePaused: state.game.paused,
    lastResolvedLines: state.layout.lastResolvedLines,
    cmpAlert: null,
    cmpDelay: null,
    randomBg: null,
  })
)(Field);
