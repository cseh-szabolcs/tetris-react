import * as redux from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import library from 'tetris-library';
import Reducers from 'tetris-reducers';
import { syncMasterMiddleware, syncSlaveMiddleware, webSocketMiddleware, MASTER_TAB } from './middleware'



/**
 * store-factory
 *
 */
export default (logics = [], initialState = {}) => {

  let middleware;

  if (MASTER_TAB) {
    middleware = redux.applyMiddleware(
      webSocketMiddleware(),
      syncMasterMiddleware(),
      createLogicMiddleware(logics, {
        tetris: library.tetris,
        ws: library.tetris.webSocket,
      }),
    );
  } else {
    middleware = redux.applyMiddleware(
      syncSlaveMiddleware(),
    );
  }

  // here we put all our reducers together
  let reducer = redux.combineReducers(Reducers);

  return redux.createStore(reducer, initialState, redux.compose(
    // extend redux-behaviour by adding the middleware
    middleware,
    // active browser-dev-tools
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
};
