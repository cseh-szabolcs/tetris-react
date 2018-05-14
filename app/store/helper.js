
/**
 * Is true when master-tab
 */
export const MASTER_TAB = !localStorage.getItem('tetris-master-tab');


/**
 * A workaround to access the store
 *
 */
export const storeBrokerHelper = {
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
