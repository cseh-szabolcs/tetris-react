
import authReducer from './auth';
import chatReducer from './chat';
import fieldReducer from './field';
import gameReducer from './game';
import layoutReducer from './layout';
import onlineReducer from './online';
import stoneReducer from './stone';
import windowReducer from './window';


export default {
  auth: authReducer,
  chat: chatReducer,
  field: fieldReducer,
  game: gameReducer,
  layout: layoutReducer,
  online: onlineReducer,
  stone: stoneReducer,
  window: windowReducer,
};
