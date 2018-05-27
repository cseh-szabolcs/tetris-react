
import * as redux from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import library from 'library';
import Reducers from 'tetris-reducers';
import { syncMasterMiddleware, syncSlaveMiddleware, webSocketMiddleware, MASTER_TAB } from './middleware'



/**
 * store-factory
 */
export default (logics = [], initialState = {}) => {

  const logicDept = {
    tetris: library.tetris,
    timeout: library.timeout,
    ws: library.websocket,
  };

  // select required middleware
  const middlewareModules = (MASTER_TAB)
    ? [webSocketMiddleware(), syncMasterMiddleware(), createLogicMiddleware(logics, logicDept)]
    : [syncSlaveMiddleware()];

    // create middleware and reducer
  const middleware = redux.applyMiddleware.apply(this, middlewareModules);
  const reducer = redux.combineReducers(Reducers);

  const devToolsExtension = (location.hostname === '0.0.0.0' && window.devToolsExtension)
    ? window.devToolsExtension()
    : f => f;

  // CORE
  return redux.createStore(
    reducer,
    initialState,
    redux.compose(
      middleware, // extend redux-behaviour by adding the middleware
      devToolsExtension // active browser-dev-tools
    )
  );
};
