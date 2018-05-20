import React from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';

import actions from 'tetris-actions';
import Alert from './Alert';


/**
 * Renders an single chat-window
 *
 */
export class Window extends React.PureComponent
{

  state = {
    message: '',
    alertAction: null,
  };


  constructor()
  {
    super();
    this.length = 0;

    this.setWindowRef = this.setWindowRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  componentDidMount()
  {
    this.setFocus(true);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount()
  {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.messages.length !== this.props.messages.length && this.chat) {
      jQuery(this.chat).scrollTop(jQuery(this.chat)[0].scrollHeight);
      // this.chat.scrollIntoView({ block: "end" })
    }
  }

  setWindowRef(node) {
    this.windowRef = node;
  }

  render()
  {
    const { user, messages, isEnabled = true, disabledText='disabled' } = this.props;

    return (
      <div ref={ this.setWindowRef }
        className={"tetris-chat-window " + ((this.props.focusedWindow === this.props.room) ? '_focus' : '_blur')}
        onClick={ e => this.setFocus(true, e) }
        onMouseDown={ e => this.setFocus(true, e) }
        tabIndex="-1"
      >
        <div className="tetris-chat-grid">
          <div className="tetris-chat-title">

            <span className="text ellipsis">
              { user.userName }
            </span>

            <Alert room={ this.props.room }
              render="multiPlayActions"
              action={ this.state.alertAction }
              onAction={ action => this.setState({ alertAction: action }) }
            />

            <span onClick={ e => this.handleClose(e) }
              title="close window"
              className="badge primary pointer transition">
              x
            </span>
          </div>

          <div className="tetris-chat-body" ref={ el => { this.chat = el; } }>
            <ul>
              <Alert room={ this.props.room }
                render="content"
                action={ this.state.alertAction }
              />

              { !this.state.alertAction && this.renderMessages(messages) }
            </ul>
          </div>

          <input type="text"
            ref={ input => { this.messageInput = input; } }
            value={ this.state.message }
            onKeyPress={ e => this.handleInputKeyPress(e) }
            onChange={ e => this.setState({message: e.target.value}) }
            disabled={ (!isEnabled || (this.state.alertAction !== null)) }
            placeholder={ isEnabled ? 'Your message...' : disabledText }
            className="text"
          />
        </div>
      </div>
    );
  }


  renderMessages(messages)
  {
    let list = [], i = 1;
    for (const message of messages) {
      list.push(
        <li key={ `c${i++}` } className={ `tetris-chat-message${(message.initial) ? ' _mine' : ''}` }>
          <div>
            { message.body }
          </div>
        </li>
      );
    }
    return list;
  }


  handleInputKeyPress(e)
  {
    if (e.key !== 'Enter') {
      return;
    }

    if (this.props.isMultiPlayStatus) {
      return;
    }

    const message = this.state.message.trim();

    if (message !== '') {
      this.props.send(message, this.props.room);
      this.setState({message: ''});
    }
  }


  handleClose(e)
  {
    e.stopPropagation();
    this.setFocus(false);
    this.props.close(this.props.room);
  }


  handleClickOutside(event, force = false)
  {
    if (this.windowRef && !this.windowRef.contains(event.target)) {
      this.setFocus(false);
    }
  }


  setFocus(value, e = null)
  {
    if (e) {
      e.stopPropagation();
    }

    if (value && this.props.focusedWindow === this.props.room) {
      return;
    }

    if (!value && this.props.focusedWindow !== this.props.room) {
      return;
    }

    if (value) {
      window.setTimeout(() => this.messageInput.focus());
    }

    this.props.windowFocus(value
      ? this.props.room
      : null
    );
  }
}



export default connect(
  (state) => ({
    focusedWindow: state.chat.focused,
    isEnabled: state.window.masterTab,
    isMultiPlayStatus: false, //(state.multiplay.status > 0),
    disabledText: 'Wrong tab!'
  }),
  (dispatch) => ({
    send: (message, room) => dispatch(actions.chat.messageSend({ room, message })),
    close: room => dispatch(actions.chat.close({ room })),
    windowFocus: room => dispatch(actions.chat.windowFocus({ room })),
  })
)(Window);
