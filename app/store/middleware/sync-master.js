
/**
 * Contains true when master-tab
 */
export const MASTER_TAB = !localStorage.getItem('tetris-master-tab');


/**
 * Writes all actions to the local-storage for possible slaves
 *
 */
export default (storage = localStorage) => {

  // mark current tab/window as master in storage
  storage.setItem('tetris-master-tab', '1');

  window.onunload = () => {
    storage.removeItem('tetris-master-tab');
    storage.removeItem('tetris-sync-action');
  };

  // CORE: write to storage on every state-change
  return store => next => action => {
    const stampedAction = timestampAction(action);
    storage.setItem('tetris-sync-action', JSON.stringify(stampedAction));

    setTimeout(() => {
      storage.setItem('tetris-sync-store', JSON.stringify(store.getState()));
    }, 100);

    return next(action);
  }
};


function timestampAction(action) {
  return {
    action,
    time: Date.now()  // add time-stamp to force local-storage to update
  }
}
