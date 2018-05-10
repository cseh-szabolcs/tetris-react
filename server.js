const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const SocketServer = WebSocket.Server;


/**
 * ===================================================================
 * Server for http and webSocket
 * ===================================================================
 */
class Server {

  /**
   * Creates all servers and application
   */
  constructor(port, web)
  {
    this.createHttpServer(port, web);
    this.createSocketServer();

    this.clients = {};
    this.handlers = {};
    this.tokens = {};
    this.rooms = {};
    this.cxn = 0;
  }

  /**
   * Create express http-server
   */
  createHttpServer(port, web)
  {
    this.server = express()
      .use((req, res) => res.sendFile(`${web}/${req.originalUrl}`))
      .listen(port, () => console.log(`Server.createHttpServer: Express server is up on port ${port}`));
  }

  /**
   * Create more stupid webSocket-server
   */
  createSocketServer()
  {
    this.wss = new SocketServer({ server:this.server });

    this.wss.on('connection', ws => {
      console.log('Server.createSocketServer: Client connected');
      ws.on('close', () => {
        console.log('Server.createSocketServer: Client disconnected');

        // remove client from client-list
        for (let uid of Object.keys(this.clients)) {
          if (this.clients[uid] === ws) {
            this.removeClient(uid);
            this.resolve('SERVER_DXN', uid);
            break;
          }
        }
      });

      // add new connected client to list
      this.clients[++this.cxn] = ws;
      this.resolve('SERVER_CXN', this.cxn);

      // when new message received
      ws.on('message', request => {
        let data = this.parseIncomingData(request);
        this.resolve(data.action, data.uid, data.token, data.room, data.payload);
      });

      // handle errors
      ws.on('error', () => console.log('Server.createSocketServer: WebSocketServer error happened'));
    });
  }

  /**
   * Executes the registered handle-functions to handle the request by using dependency-injection
   */
  resolve(action, uid, token = null, room = null, payload = null)
  {
    if (!this.handlers[action]) {
      return;
    }

    let handler = this.handlers[action];

    if (handler.depts.indexOf('token') !== -1 && !token) {
      return; // do nothing when token is expected and no token defined in request
    }

    if (handler.depts.indexOf('payload') !== -1 && (!payload || payload.constructor != Object)) {
      return; // do nothing when request is expected but the there is no request-payload given
    }

    Injector.register('uid', uid);
    Injector.register('token', token);
    Injector.register('room', room);
    Injector.register('payload', payload);
    Injector.register('request', new Request(action, payload));

    const resolver = Injector.resolve(handler.depts, handler.callable, this);
    if (resolver && resolver.constructor == Function) {
      resolver();
    }
  }

  /**
   * Registers an handle-function with dependencies for an action (route)
   */
  handle(action, depts)
  {
    if (depts.length === 0) {
      return;
    }
    const callable = depts.splice(-1,1)[0];

    if (!callable || callable.constructor != Function) {
      return;
    }

    this.handlers[action] = {depts: Injector.split(depts), callable};
    return this;
  }

  /**
   * Send message to an single client
   */
  send(uid, type, payload)
  {
    if (!uid) {
      return;
    }

    let client = (uid.constructor == Number)
      ? ((this.clients[uid]) ? this.clients[uid] : null)
      : uid;

    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({
          type,
          payload
        }));
      } catch (e) {
        console.log('Server.send: Not able to sent message via WebSocketServer');
      }
    }
  }

  /**
   * Send message to all connected clients
   */
  sendToAll(type, payload)
  {
    this.wss.clients.forEach(client => this.send(client, type, payload));
  }

  /**
   * Creates an new room if not exists
   */
  openRoom(name, tokens, addToken = false)
  {
    if (this.rooms[name]) {
      if (addToken) {
        for (let token of tokens) {
          if (this.rooms[name].indexOf(token) === -1) {
            this.rooms[name].push(token);
          }
        }
      }
    } else {
      this.rooms[name] = tokens;
    }
    return this;
  }

  /**
   * Sends an message to all clients in this room-name
   */
  sendToRoom(name, type, payload)
  {
    if (!this.rooms[name] || this.rooms[name].length === 0) {
      console.log(`Server.sendToRoom: Skip send to room '${name}' because not found.`);
      return;
    }

    for (let token of this.rooms[name]) {
      let uid = this.getUid(token);

      if (uid) {
        this.send(uid, type, payload);
        continue;
      }
      console.log(`Server.sendToRoom: Skip send for token '${token}' because no uid's found.`);
    }
  }

  /**
   * Returns all registered tokens from given room-name
   */
  getRoomTokens(name, excludeToken = null)
  {
    if (!this.rooms[name]) {
      return [];
    }

    let tokens = [];

    if (excludeToken) {
      for (let token of this.rooms[name]) {
        if (token !== excludeToken) {
          tokens.push(token);
        }
      }
    } else {
      tokens = [...this.rooms[name]];
    }

    return tokens;
  }

  /**
   * Creates an security identifier token which can be used in the application for more security
   */
  createToken(uid, token = null)
  {
    token = (token && token.constructor == String && token.length > 5 && token.length < 100)
      ? token
      : this.createHash(uid);

    this.tokens[token] = uid;
    return token;
  }

  /**
   * Returns the uid by given token
   */
  getUid(token)
  {
    return this.tokens[token]
      ? this.tokens[token]
      : false;
  }

  /**
   * Returns the token-string by given uid
   */
  getToken(uid)
  {
    for (const [token, _uid] of Object.entries(this.tokens)) {
      if (uid === _uid) {
        return token;
      }
    }
    return false;
  }

  /**
   * Parses data to json and check action-action
   */
  parseIncomingData(requestData)
  {
      if (!requestData) {
        return false;
      }

      try {
        let data = JSON.parse(requestData);

        if (!data || !data.constructor == Object || !data.action) {
          return false; // not valid data
        }

        if (!data.uid && !data.token) {
          return false; // no auth-data send
        }

        if (data.uid && !this.clients[data.uid]) {
          return false; // unknown uid
        }

        if (data.token && (data.token.length < 5 || data.token.length > 100 || !this.tokens[data.token])) {
          return false; // unknown token
        }

        if (data.room && !this.rooms[data.room]) {
          return false; // unknown room-name
        }

        // get uid
        const uid = (data.uid) ? data.uid : this.tokens[data.token];

        if (!this.clients[uid]) {
          return false; // unknown client by token-request
        }

        data.uid = parseInt(uid);
        data.token = (data.token) ? data.token : null;

        return data;

      } catch (e) {
        return false;
      }
  }

  /**
   * Removes all client-references from server-props
   */
  removeClient(uid)
  {
    uid = parseInt(uid);
    delete this.clients[uid];

    const token = this.getToken(uid);
    if (token) {
      delete this.tokens[token];
    }
  }

  /**
   * Generates an unique identifier
   */
  createHash(salt = '')
  {
    return ((Math.random().toString(36).substr(2, 9)) + salt);
  }
}


/**
 * ===================================================================
 * Request object
 * ===================================================================
 */

class Request {

  constructor(action, payload) {
    this.action = action;
    this.payload = payload;
  }

  has(key, type = null) {
    if (!this.payload || this.payload.constructor != Object) {
      return false;
    }
    if (this.payload[key] === undefined || this.payload === null) {
      return false;
    }
    if (type && this.payload[key].constructor != type) {
      return false;
    }

    return true;
  }

  get(key, value = null)
  {
    return this.has(key)
      ? this.payload[key]
      : value;
  }

  vGet(key, validator, value = null)
  {
    if (validator && validator.constructor == Function) {
      return validator(this.get(key, value))
        ? this.get(key)
        : value;
    }
    return value;
  }

  tGet(key, type, value = null)
  {
    return this.has(key, type)
      ? this.get(key)
      : value;
  }

  getAll() {
    return this.payload;
  }
}


/**
 * ===================================================================
 * A helper for dependency injection
 * ===================================================================
 */

const Injector = {
  dependencies: {},

  register: function(key, value) {
    this.dependencies[key] = value;
  },

  resolve: function(deps, func, scope) {
    let args = [];
    for (let key of deps) {
      if (this.dependencies[key]) {
        args.push(this.dependencies[key]);
      } else {
        console.log(`Injector: Can't resolve key '${key}'`);
        return;
      }
    }
    return function() {
      func.apply(scope || {}, args.concat(Array.prototype.slice.call(arguments, 0)));
    }
  },

  split: function(depts) {
    if (depts.length !== 1) {
      return depts;
    }
    if (depts[0].indexOf(',') === -1) {
      return depts;
    }
    let arrDepts = [];
    depts = depts[0].split(',');
    for (let key of depts) {
      arrDepts.push(key.trim());
    }
    return arrDepts;
  }

};


/**
 * ===================================================================
 * RUN!
 * ===================================================================
 */

module.exports = new Server(
  (process.env.PORT || 3001),   // port
  path.join(__dirname, 'public')   // public folder
);
