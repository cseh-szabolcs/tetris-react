import actions from 'tetris-actions';

export const MASTER_TAB = !localStorage.getItem('tetris-master-tab');


/**
 * A workaround to access the store
 *
 */
export const middlewareBroker = {
  store: null,

  setStore: function(store) {
    this.store = store;
  },
  getStore: function(store) {
    return this.store;
  },
  hasStore: function() {
    return (this.store !== null);
  },
};


/**
 * Writes all actions to the local-storage for possible slaves
 *
 */
export const syncMasterMiddleware = (storage = localStorage) => {

  // mark current tab/window as master in storage
  (() => {
    storage.setItem('tetris-master-tab', '1');
    window.onunload = () => {
      storage.removeItem('tetris-master-tab');
      storage.removeItem('tetris-sync-action');
    };
  })();

  // CORE: write to storage on every state-change
  return () => next => action => {
    const stampedAction = timestampAction(action);

    storage.setItem('tetris-sync-action', JSON.stringify(stampedAction));
    next(action);

    setTimeout(() => {
      storage.setItem('tetris-sync-store', JSON.stringify(middlewareBroker.getStore().getState()));
    }, 100);
  }
};


/**
 * CORE: Reads the actions from the local-storage and call dispatch to sync redux
 *
 */
export const syncSlaveMiddleware = (storage = localStorage) => {

  // sync the complete master-state to requesting slave
  (() => {
    setTimeout(() => {
      try {
        middlewareBroker.getStore().dispatch(
          actions.window.restoreSlave(
            JSON.parse(storage.getItem('tetris-sync-store'))
          )
        );
      } catch (e) { }
    });
  })();

  // the storage event tells you which value changed
  window.addEventListener('storage', event => {
    if (middlewareBroker.hasStore()) {
      try {
        const {action} = JSON.parse(event.newValue);
        middlewareBroker.getStore().dispatch(action);
      } catch (e) { }
    }
  });

  return () => next => action =>  next(action);
};


/**
 * A helper to mark all actions with an time to ignore the old ones, on slave-tab/window open
 *
 */
function timestampAction(action) {
  return {
    action,
    time: Date.now()  // add time-stamp to force local-storage to update
  }
}