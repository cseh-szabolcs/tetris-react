
import actions from 'tetris-actions';


/**
 * CORE: Reads the actions from the local-storage and call dispatch to sync redux
 *
 */
export default (storage = localStorage) => {

  return store => {

    // sync the complete master-state to requesting slave
    setTimeout(() => {
      try {
        store.dispatch(
          actions.window.restoreSlave(
            JSON.parse(storage.getItem('tetris-sync-store'))
          )
        );
      } catch (e) { }
    });

    // the storage event tells you which value changed
    window.addEventListener('storage', event => {
      try {
        const {action} = JSON.parse(event.newValue);
        store.dispatch(action);
      } catch (e) { }
    });

    return next => action => next(action);
  };
};
