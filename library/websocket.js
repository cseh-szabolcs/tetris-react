
/**
 * A simple helper to use webSocket
 *
 */

export default {

  ws: null,
  listeners: [],

  /**
   * create a webSocket object
   */
  create: function() {
    if (!'WebSocket' in window) {
      return false;
    }

    const protocol = (window.location.href.split("/")[0] === 'https:') ? 'wss' : 'ws';
    const host = location.hostname + (location.port ? ':'+location.port: '');

    this.ws = new WebSocket(protocol + '://' + host);

    this.ws.onmessage = event => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.log('Tetris-WebSocket: Cannot parse data from server.');
        return;
      }

      for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i](data, event);
      }
    };

    return true;
  },

  /**
   * call create, when no webSocket created yet
   */
  init: function () {
    if (this.ws === null) {
      this.create();
    }
    return (this.ws !== false);
  },

  /**
   * sends data to server
   */
  send: function(payload)
  {
    if (this.init()) {
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (e) {
        throw 'Tetris-WebSocket: Cannot send data with given payload.'
      }
    }
  },

  /**
   * registers listener functions
   */
  addListener: function(callable) {
    if (this.init()) {
      if (!callable || callable.constructor != Function) {
        throw 'Tetris-WebSocket: Given listener must be a function.'
      }
      this.listeners.push(callable);
    }
    return callable;
  }

};
