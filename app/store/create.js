import * as redux from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import Reducers from 'tetris-reducers';
import { MASTER_TAB, syncMasterMiddleware, syncSlaveMiddleware, middlewareBroker } from './middleware';

/**
 * store-factory
 *
 */
export default (logics = [], initialState = {}) => {

  let middleware;

  if (MASTER_TAB) {
    middleware = redux.applyMiddleware(
      syncMasterMiddleware(),               // store-sync for master tab/window
      createLogicMiddleware(logics, {})     // redux-logic extension for business-logic
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

  middlewareBroker.setStore(store);

  return store;
};
