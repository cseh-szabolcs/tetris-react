
import actions from 'tetris-actions';


/**
 * Reads the actions/state from the local-storage and call dispatch to sync redux
 *
 */
export default (storage = localStorage) => {
  let masterPingConfirmed = false;

  return store => {

    // ping to master, otherwise the is no master and we have to reload this page
    setTimeout(() => {
      storage.setItem('tetris-ping', (Math.floor(Date.now()/1000)+''));

      setTimeout(() => {
        if (!masterPingConfirmed) {
          store.dispatch({type: 'WINDOW_PING_FAILED'});
        }
      }, 1000);
    });

    let q = window.addEventListener('storage', event => {
      if (event.key === 'tetris-pong') {
        masterPingConfirmed = true;
        window.removeEventListener('storage', q);
      }
    });


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
