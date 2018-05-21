
import React from 'react';
import { connect } from 'react-redux';


/**
 * Renders the field and the score from other user.
 *
 */
class Field extends React.PureComponent
{

  render()
  {
    return (
      <div className="tetris-chat-modal field">
        <table>
          <tbody>
            { this.renderFieldRows() }
          </tbody>
        </table>
      </div>
    );
  }


  renderFieldRows()
  {
    let field = this.props.field, result = [];

    for (let r in field) {
      result.push(
        <tr key={ `r${r}` }>
          { this.renderFieldCols(field[r]) }
        </tr>
      );
    }
    return result;
  }


  renderFieldCols(row)
  {
    let result = [];

    for (let c in row) {
      result.push(
        <td key={ `r${c}` }>
          <span className={ `cell ${(row[c]) > 0 ? 'set' : ''}` } />
        </td>
      );
    }
    return result;
  }

}


export default connect(
  (state) => ({
    scores: 0, // state.multiplay.scoreState,
    field: state.multiplay.otherField,
  }),
)(Field);
