const Server = require('./server');


/**
 * Send uid to client, the uid is required for every request
 */
Server.handle('SERVER_CXN', ['request, uid', function(request, uid)
{
  this.send(uid, request.action, {
    uid: uid,
    users: Db.getAll('user'),
  });
}]);


/**
 * An new user wants to join the game
 */
Server.handle('AUTH_JOIN', ['uid, request, payload', function(uid, request)
{
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
  });

  this.send(uid, 'SERVER_AUTH_JOIN', {
    token,
    userName,
  });

  this.sendToAll('SERVER_USERS_JOIN', {
    user: Db.get('user', uid),
  });
}]);


/**
 * User wants to write to another user
 */
Server.handle('CHAT_OPEN', ['uid, token, request, payload', function(uid, token, request)
{
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

  this.sendToRoom(room, 'CHAT_RECEIVED', {
    room,
    senderUid: sender.uid,
    recipientUid: recipient.uid,
    message: null,
  });
}]);


/**
 * User wrote a message to another user
 */
Server.handle('CHAT_SEND', ['uid, token, room, request, payload', function(uid, token, room, request)
{
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

  this.sendToRoom(room, 'CHAT_RECEIVED', {
    room,
    senderUid: sender.uid,
    recipientUid: recipient.uid,
    message: request.get('message'),
  });
}]);


/**
 * User wrote a message to another user
 */
Server.handle('MULTIPLAY_INVITE', ['uid, token, room, request, payload', function(uid, token, room, request)
{
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

  const LEVEL_MIN = 1;
  const LEVEL_MAX = 9;

  this.sendToRoom(room, 'MULTIPLAY_INVITATION', {
    room,
    senderUid: sender.uid,
    recipientUid: recipient.uid,
    level: request.vGet('level', val => (val > LEVEL_MIN && val < LEVEL_MAX), LEVEL_MIN),
    strict: request.tGet('strict', Boolean, true),
  });
}]);


/**
 * User quits an multi-player game
 */
Server.handle('MULTIPLAY_CONFIRM', ['uid, token, room', function(uid, token, room)
{
  this.sendToRoom(room, 'MULTIPLAY_START', {
    room,
  });
}]);


/**
 * User quits an multi-player game
 */
Server.handle('MULTIPLAY_QUIT', ['uid, token, room, request', function(uid, token, room, request)
{
  const sender = Db.get('user', uid);
  if (!sender) {
    return;
  }

  this.sendToRoom(room, request.action, {
    room,
    senderUid: sender.uid,
  });
}]);


/**
 * User quits an multi-player game
 */
Server.handle('MULTIPLAY_STONE_INSERTED', ['uid, token, room, request', function(uid, token, room, request)
{
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

  this.send(recipient.uid, request.action, {
    fieldState: request.get('fieldState'),
    scoreState: request.get('scoreState'),
  });
}]);



/**
 * User leave the game -> notify all
 */
Server.handle('AUTH_LEAVE', ['request, uid, token', function(request, uid)
{
  Db.remove('user', uid);

  this.sendToAll('SERVER_ONLINE_LEAVE', {
    uid: uid,
  });
}]);



/**
 * Connection closed (user closed the window) -> notify all
 */
Server.handle('SERVER_DXN', ['uid', function(uid)
{
  Db.remove('user', uid);

  this.sendToAll('SERVER_ONLINE_LEAVE', {
    uid: uid,
  });
}]);


/**
 * ===================================================================
 * A simple stupid database
 * ===================================================================
 */

const Db = {
  user: {},

  add: function(table, id, data) {
    this[table][id] = data;
    return this;
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
