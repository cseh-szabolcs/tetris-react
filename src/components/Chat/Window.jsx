
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
    alert: null,
  };


  constructor()
  {
    super();

    this.setWindowRef = this.setWindowRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  componentDidMount()
  {
    this.setFocus(true);
    document.addEventListener('mousedown', this.handleClickOutside);

    if (this.props.window.alert) {
      this.setState({alert: this.props.window.alert});
    }
  }


  componentWillUnmount()
  {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }


  componentDidUpdate(prevProps) {
    if (prevProps.window.messages.length !== this.props.window.messages.length && this.chatRef) {
      jQuery(this.chatRef).scrollTop(jQuery(this.chatRef)[0].scrollHeight);
      // this.chatRef.scrollIntoView({ block: "end" })
    }
  }


  setWindowRef(node) {
    this.windowRef = node;
  }


  render()
  {
    const { user, window, isEnabled = true, disabledText='disabled' } = this.props;

    return (
      <div ref={ this.setWindowRef }
        className={"tetris-chat-window " + ((this.props.focusedWindow === window.room) ? '_focus' : '_blur')}
        onClick={ e => this.setFocus(true, e) }
        onMouseDown={ e => this.setFocus(true, e) }
        tabIndex="-1"
      >
        <div className="tetris-chat-grid">
          <div className="tetris-chat-title">

            <span className="text ellipsis">
              { user.userName }
            </span>

            <Alert
              room={ window.room }
              render="actionButtons"
              value={ window.alert }
              onValueChanged={ value => this.setState({ alert: value }) }
            />

            <span onClick={ e => this.handleClose(e) }
              title="close window"
              className="badge primary pointer transition">
              x
            </span>
          </div>

          <div className="tetris-chat-body" ref={ el => { this.chatRef = el; } }>
            <ul>
              <Alert
                room={ window.room }
                render="content"
                value={ this.state.alert }
              />

              { this.renderMessages(window.messages) }
            </ul>
          </div>

          <input type="text"
            ref={ input => { this.messageInput = input; } }
            value={ (this.state.alert) ? '' : this.state.message }
            onKeyPress={ e => this.handleInputKeyPress(e) }
            onChange={ e => this.setState({message: e.target.value}) }
            disabled={ (!isEnabled || this.state.alert !== null) }
            placeholder={ this.getPlaceholderText() }
            className="text"
          />
        </div>
      </div>
    );
  }


  renderMessages(messages)
  {
    if (this.state.alert) {
      return null;
    }

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

    const message = this.state.message.trim();
    const room = this.props.window.room;

    if (message !== '') {
      this.props.send(message, room);
      this.setState({message: ''});
    }
  }


  handleClose(e)
  {
    e.stopPropagation();
    this.setFocus(false);

    const room = this.props.window.room;
    this.props.close(room);
  }


  handleClickOutside(event)
  {
    if (this.windowRef && !this.windowRef.contains(event.target)) {
      this.setFocus(false);
    }
  }


  setFocus(value, e = null)
  {
    if (this.props.isMultiplay) {
      this.props.windowFocus(null);
      return;
    }

    const room = this.props.window.room;

    if (e) {
      e.stopPropagation();
    }

    if (value && this.props.focusedWindow === room) {
      return;
    }

    if (!value && this.props.focusedWindow !== room) {
      return;
    }

    if (value) {
      window.setTimeout(() => this.messageInput.focus());
    }

    this.props.windowFocus(value ? room : null);
  }


  getPlaceholderText()
  {
    if (!this.props.isEnabled) {
      return this.props.disabledText;
    }
    if (this.state.alert) {
      return '---';
    }
    return 'Your message...';
  }
}



export default connect(
  (state) => ({
    focusedWindow: state.chat.focused,
    isMultiplay: (state.game.multiplay && state.game.running),
    isEnabled: state.window.masterTab,
    disabledText: 'Wrong tab!'
  }),
  (dispatch) => ({
    send: (message, room) => dispatch(actions.chat.messageSend({ room, message })),
    close: room => dispatch(actions.chat.close({ room })),
    windowFocus: room => dispatch(actions.chat.windowFocus({ room })),
  })
)(Window);
