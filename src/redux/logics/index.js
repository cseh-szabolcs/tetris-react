
import * as auth from './auth';
import * as field from './field';
import * as game from './game';
import * as online from './online';
import * as stone from './stone';


export default [
  // last!
  online.onlineLogic,
  auth.leaveLogic,
  auth.joinLogic,
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
