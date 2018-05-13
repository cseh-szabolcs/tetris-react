
import fieldReducer from './field';
import gameReducer from './game';
import layoutReducer from './layout';
import stoneReducer from './stone';
import windowReducer from './window';


export default {
  field: fieldReducer,
  game: gameReducer,
  layout: layoutReducer,
  stone: stoneReducer,
  window: windowReducer,
};
