
import authReducer from './auth';
import fieldReducer from './field';
import gameReducer from './game';
import layoutReducer from './layout';
import onlineReducer from './online';
import stoneReducer from './stone';
import windowReducer from './window';


export default {
  auth: authReducer,
  field: fieldReducer,
  game: gameReducer,
  layout: layoutReducer,
  online: onlineReducer,
  stone: stoneReducer,
  window: windowReducer,
};
