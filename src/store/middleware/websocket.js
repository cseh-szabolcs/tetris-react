
import library from 'tetris-library';


/**
 * Dispatch actions to the store when web-socket-messages arrives
 *
 */
export default () => {

  return store => {
    const ws = library.tetris.webSocket;

    // on error
    if (!ws.create()) {
      dispatch({ type: 'WEBSOCKET_ERROR' });
      return;
    }

    // CORE: add listener
    ws.addListener(response => {
      if (!response || !response.type) {
        return;
      }

      store.dispatch({
        type: response.type,
        payload: response.payload ? response.payload : null,
      });
    });

    return next => action => next(action);
  };
};
