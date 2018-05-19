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
    inviteUser: false,
    message: '',
  };


  constructor()
  {
    super();
    this.length = 0;
  }


  componentDidMount()
  {
    if (this.props.isEnabled) {
      this.messageInput.focus();
    }
  }


  componentDidUpdate(prevProps) {
    if (this.props.isMultiPlayStatus) {
      this.setState({inviteUser: false});
    }

    if (prevProps.messages.length !== this.props.messages.length && this.chat) {
      jQuery(this.chat).scrollTop(jQuery(this.chat)[0].scrollHeight);
      // this.chat.scrollIntoView({ block: "end" })
    }
  }


  render()
  {
    const { user, messages, isEnabled = true, disabledText='disabled' } = this.props;
    const renderAlert = (this.state.inviteUser || this.props.isMultiPlayStatus);

    return (
      <div className="tetris-chat-window">
        <div className="tetris-chat-grid">
          <div className="tetris-chat-title">

            <span className="text ellipsis">
              { user.userName }
            </span>

            { !renderAlert && (
              <a onClick={ () => this.handleInvite() }
                 className="button warning"
                 href="#"
                 title="click here to play in two-player-mode!">
                Invite to Play!
              </a>
            )}

            { renderAlert && (
              <a onClick={ () => this.handleQuit() }
                 className="button alert"
                 href="#">
                { this.props.isMultiPlayStatus ? 'Quit' : 'Cancel' }
              </a>
            )}

            <span onClick={ () => this.handleClose() }
              title="close window"
              className="badge primary pointer transition">
              x
            </span>
          </div>

          <div className="tetris-chat-body" ref={ el => { this.chat = el; } }>
            <ul>
              { (renderAlert)
                ? this.renderAlert()
                : this.renderMessages(messages)
              }
            </ul>
          </div>

          <input type="text"
            ref={ input => { this.messageInput = input; } }
            value={ this.state.message }
            onKeyPress={ e => this.handleInputKeyPress(e) }
            onChange={ e => this.setState({message: e.target.value}) }
            disabled={ (!isEnabled || renderAlert) }
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


  renderAlert()
  {
    return (
      <Alert room={ this.props.room } />
    );
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


  handleInvite()
  {
    this.setState({inviteUser: true});
  }


  handleQuit()
  {
    if (this.props.isMultiPlayStatus) {
      this.props.quitMultiPlay();
    } else {
      this.setState({inviteUser: false});
    }
  }


  handleClose()
  {
    this.props.close(this.props.room);
  }
}



export default connect(
  (state) => ({
    isEnabled: state.window.masterTab,
    isMultiPlayStatus: false, //(state.multiplay.status > 0),
    disabledText: 'Wrong tab!'
  }),
  (dispatch) => ({
    send: (message, room) => dispatch(actions.chat.messageSend({ room, message })),
    close: room => dispatch(actions.chat.close({ room })),
    quitMultiPlay: () => dispatch(actions.multiplay.quit()),
  })
)(Window);
