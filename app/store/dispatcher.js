
import library from 'tetris-library';



/**
 * Dispatch actions to the store when web-socket-messages arrives
 *
 */
export const webSocketDispatcher = (dispatch) => {

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

    dispatch({
      type: response.type,
      payload: response.payload ? response.payload : null,
    });
  });

};