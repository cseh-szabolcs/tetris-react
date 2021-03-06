
import * as auth from './auth';
import * as chat from './chat';
import * as field from './field';
import * as game from './game';
import * as multiplay from './multiplay';
import * as online from './online';
import * as stone from './stone';


export default [
  // last!
  auth.leaveLogic,
  auth.joinLogic,
  multiplay.gameLogic,
  multiplay.cancelLogic,
  multiplay.invitationLogic,
  chat.messengerLogic,
  chat.openLogic,
  online.statusLogic,
  online.relationLogic,
  online.onlineLogic,
  field.addLinesLogic,
  field.removeLinesLogic,
  stone.rotateLogic,
  stone.moveSideLogic,
  stone.pullDownLogic,
  stone.moveDownLogic,
  stone.insertLogic,
  stone.createStoneLogic,
  game.pauseLogic,
  game.gameOverLogic,
  game.countDownLogic,
  game.intervalLogic,
  game.nextLogic,
  // first!
];
