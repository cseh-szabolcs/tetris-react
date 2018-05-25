
module.exports = function(Server) {

  /**
   * Send uid to client, the uid is required for every request
   */
  Server.handle('SERVER_CXN', ['request, uid', function(request, uid) {
    this.send(uid, request.action, {
      uid: uid,
      users: Db.getAll('user'),
    });
  }]);


  /**
   * An new user wants to join the game
   */
  Server.handle('AUTH_JOIN', ['uid, request, payload', function(uid, request) {
    if (!request.has('userName', String)) {
      return;
    }

    const token = this.createToken(uid, request.has('token')
      ? request.get('token')
      : null
    );

    const userName = request.get('userName').trim();

    Db.add('user', uid, {
      uid,
      token,
      userName,
      status: 1,
    });

    this.send(uid, 'SERVER_AUTH_JOIN', {
      token,
      userName,
    });

    this.sendToAll('SERVER_ONLINE_JOIN', {
      user: Db.get('user', uid),
    });
  }]);


  /**
   * User wants to write to another user
   */
  Server.handle('CHAT_OPEN', ['uid, token, request, payload', function(uid, token, request) {
    if (!request.has('recipientUid', Number)) {
      return;
    }

    const sender = Db.get('user', this.getUid(token));
    if (!sender) {
      return;
    }

    const recipient = Db.get('user', request.get('recipientUid'));
    if (!recipient) {
      return;
    }

    const room = encrypt((sender.token > recipient.token)
      ? sender.token + recipient.token
      : recipient.token + sender.token
    );

    this.openRoom(room, [sender.token, recipient.token]);

    this.sendToRoom(room, 'SERVER_CHAT_OPEN', {
      room,
      senderUid: sender.uid,
      recipientUid: recipient.uid,
    });
  }]);


  /**
   * User wrote a message to another user
   */
  Server.handle('CHAT_MESSAGE_SEND', ['uid, token, room, request, payload', function(uid, token, room, request) {
    const sender = Db.get('user', uid);
    if (!sender) {
      return;
    }

    const recipientToken = this.getRoomTokens(room, token)[0];
    if (!recipientToken) {
      return;
    }

    const recipient = Db.get('user', this.getUid(recipientToken));
    if (!recipient) {
      return;
    }

    this.sendToRoom(room, 'SERVER_CHAT_MESSAGE', {
      room,
      senderUid: sender.uid,
      recipientUid: recipient.uid,
      message: request.get('message'),
    });
  }]);


  /**
   * User wrote a message to another user
   */
  Server.handle('MULTIPLAY_INVITE', ['uid, token, room, request, payload', function(uid, token, room, request) {
    const sender = Db.get('user', uid);
    if (!sender) {
      return;
    }

    const recipientToken = this.getRoomTokens(room, token)[0];
    if (!recipientToken) {
      return;
    }

    const recipient = Db.get('user', this.getUid(recipientToken));
    if (!recipient) {
      return;
    }

    this.sendToRoom(room, 'SERVER_MULTIPLAY_INVITE', {
      room,
      senderUid: sender.uid,
      recipientUid: recipient.uid,
      level: request.tGet('level', Number, 1),
    });
  }]);


  /**
   * User accepts the an multi-player game
   */
  Server.handle('MULTIPLAY_ACCEPT', ['uid, token, room', function(uid, token, room) {

    this.sendToRoom(room, 'SERVER_MULTIPLAY_ACCEPT', {
      room,
    });

    // let all other users know about the 'not-available-status'
    _handleUserStatus(room, 2, this);
  }]);


  /**
   * User quits an multi-player game
   */
  Server.handle('MULTIPLAY_CANCEL', ['uid, token, room, request', function(uid, token, room, request) {
    const sender = Db.get('user', uid);
    if (!sender) {
      return;
    }

    this.sendToRoom(room, 'SERVER_MULTIPLAY_CANCEL', {
      room,
      senderUid: sender.uid,
    });

    // let all other users know about the 'available-status'
    _handleUserStatus(room, 1, this);
  }]);


  /**
   * User quits an multi-player game
   */
  Server.handle('MULTIPLAY_FIELD_CHANGED', ['uid, token, room, request', function(uid, token, room, request) {
    const sender = Db.get('user', uid);
    if (!sender) {
      return;
    }

    const recipientToken = this.getRoomTokens(room, token)[0];
    if (!recipientToken) {
      return;
    }

    const recipient = Db.get('user', this.getUid(recipientToken));
    if (!recipient) {
      return;
    }

    this.send(recipient.uid, 'SERVER_MULTIPLAY_FIELD_CHANGED', {
      fieldState: request.get('fieldState'),
      resolvedLines: request.get('resolvedLines'),
    });
  }]);


  /**
   * Somebody lost, somebody won :-)
   */
  Server.handle('GAME_OVER', ['uid, token, room, request', function(uid, token, room, request) {
    const sender = Db.get('user', uid);
    if (!sender) {
      return;
    }

    const recipientToken = this.getRoomTokens(room, token)[0];
    if (!recipientToken) {
      return;
    }

    const recipient = Db.get('user', this.getUid(recipientToken));
    if (!recipient) {
      return;
    }

    // core
    this.send(recipient.uid, 'SERVER_GAME_OVER');

    // let all other users know about the 'available-status'
    _handleUserStatus(room, 1, this);
  }]);


  /**
   * User leave the game -> notify all
   */
  Server.handle('AUTH_LEAVE', ['request, uid, token', function(request, uid) {
    Db.remove('user', uid);

    this.sendToAll('SERVER_ONLINE_LEAVE', {
      uid: uid,
    });
  }]);


  /**
   * Connection closed (user closed the window) -> notify all
   */
  Server.handle('SERVER_DXN', ['uid', function(uid) {
    Db.remove('user', uid);

    this.sendToAll('SERVER_ONLINE_LEAVE', {
      uid: uid,
    });
  }]);


  /**
   * An helper to change user-status in 'db' and notify all other users
   *
   */
  function _handleUserStatus(room, status, Server) {
    const tokens = Server.getRoomTokens(room);

    if (!tokens || tokens.length === 0) {
      return;
    }

    let uids = [], uid, i, user;

    for (i in tokens) {
      uid = Server.getUid(tokens[i]);
      user = Db.get('user', uid);

      if (uid.status === status || !user) {
        continue;
      }

      uids.push(Server.getUid(tokens[i]));
      Db.set('user', user.uid, Object.assign(user, {status: status}));
    }

    if (uids.length === 0) {
      return;
    }

    Server.sendToAll('SERVER_ONLINE_STATUS_CHANGED', {
      uids: uids,
      status: status,
    });
  }

};

/**
 * ===================================================================
 * A simple stupid database
 * ===================================================================
 */

const Db = {
  user: {},

  set: function(table, id, data) {
    this[table][id] = data;
    return this;

  },

  add: function(table, id, data) {
    return this.set(table, id, data);
  },

  get: function(table, id, def = null) {
    return (this[table][id])
      ? this[table][id]
      : def;
  },

  getAll: function(table) {
    return this[table];
  },

  remove(table, id) {
    if (this[table][id]) {
      delete this[table][id];
    }
    return this;
  }
};


/**
 * ===================================================================
 * Helpers
 * ===================================================================
 */

function encrypt(str) {
  let encoded = "";
  for (let i=0; i<str.length; i++) {
    let a = str.charCodeAt(i);
    let b = a ^ 123;    // bitwise XOR with any number, e.g. 123
    encoded = encoded+String.fromCharCode(b);
  }
  return encoded;
}
