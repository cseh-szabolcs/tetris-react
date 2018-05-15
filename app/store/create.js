import * as redux from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import library from 'tetris-library';
import Reducers from 'tetris-reducers';
import { syncMasterMiddleware, syncSlaveMiddleware, webSocketMiddleware, MASTER_TAB } from './middleware'


/**
 * store-factory
 */
export default (logics = [], initialState = {}) => {

  const logicDept = {tetris: library.tetris, ws: library.tetris.webSocket};

  // select required middleware
  const middlewareModules = (MASTER_TAB)
    ? [webSocketMiddleware(), syncMasterMiddleware(), createLogicMiddleware(logics, logicDept)]
    : [syncSlaveMiddleware()];

    // create middleware and reducer
  const middleware = redux.applyMiddleware.apply(this, middlewareModules);
  const reducer = redux.combineReducers(Reducers);

  // CORE
  return redux.createStore(
    reducer,
    initialState,
    redux.compose(
      middleware, // extend redux-behaviour by adding the middleware
      window.devToolsExtension ? window.devToolsExtension() : f => f // active browser-dev-tools
    )
  );
};
