
import * as field from './field';
import * as game from './game';
import * as stone from './stone';


export default [
  // last!
  field.removeLinesLogic,
  stone.rotateLogic,
  stone.moveSideLogic,
  stone.pullDownLogic,
  stone.moveDownLogic,
  stone.insertLogic,
  stone.createStoneLogic,
  game.gameOverLogic,
  game.countDownLogic,
  game.intervalLogic,
  game.nextLogic,
  // first!
];
