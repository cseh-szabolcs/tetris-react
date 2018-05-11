
import * as game from './game';
import * as stone from './stone';


export default [
  // last!
  stone.rotateLogic,
  stone.moveSideLogic,
  stone.pullDownLogic,
  stone.moveDownLogic,
  stone.insertLogic,
  stone.createStoneLogic,
  game.gameNextLogic,
  game.gameInitLogic,
  // first!
];
