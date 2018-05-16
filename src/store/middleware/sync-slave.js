
import actions from 'tetris-actions';


/**
 * Reads the actions/state from the local-storage and call dispatch to sync redux
 *
 */
export default (storage = localStorage) => {

  return store => {

    // sync the complete master-state to requesting slave (when slave is reloaded)
    setTimeout(() => {
      try {
        store.dispatch(
          actions.window.restoreSlave({
            masterState: JSON.parse(storage.getItem('tetris-sync-store')),
          })
        );
      } catch (e) { }
    });

    // CORE: Dispatch master-action when the the storage value changed
    window.addEventListener('storage', event => {
      try {
        const {action} = JSON.parse(event.newValue);
        store.dispatch(action);
      } catch (e) { }
    });

    return next => action => next(action);
  };
};
