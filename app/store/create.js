import * as redux from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import library from 'tetris-library';
import Reducers from 'tetris-reducers';
import { syncMasterMiddleware, syncSlaveMiddleware } from './middleware';
import { MASTER_TAB, storeBrokerHelper } from './helper';
import { webSocketDispatcher } from './dispatcher';


/**
 * store-factory
 *
 */
export default (logics = [], initialState = {}) => {

  let middleware;

  if (MASTER_TAB) {
    middleware = redux.applyMiddleware(
      // store-sync for master tab/window
      syncMasterMiddleware(),
      // redux-logic extension for business-logic
      createLogicMiddleware(logics, {
        tetris: library.tetris,
        ws: library.tetris.webSocket,
      }),
    );
  } else {
    middleware = redux.applyMiddleware(
      syncSlaveMiddleware()                 // store-sync for slave tab/window
    );
  }

  // here we put all our reducers together
  let reducer = redux.combineReducers(Reducers);

  let store = redux.createStore(reducer, initialState, redux.compose(
    // extend redux-behaviour by adding the middleware
    middleware,
    // active browser-dev-tools
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  // init helper
  storeBrokerHelper.setStore(store);

  // init dispatcher
  if (MASTER_TAB) {
    webSocketDispatcher(store.dispatch);
  }

  return store;
};
