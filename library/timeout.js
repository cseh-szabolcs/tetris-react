
/**
 * helper to call the window.setTimeout which supports unique timeouts
 *
 */

let q = null, promise = null;

export default ({callback, duration = 200, then = null, clear = false, unique = true}) => {

  // clear-mode
  if (clear === true) {
    if (q !== null) {
      window.clearTimeout(q);
       q = null;
    }
    return;
  }

  // execute an not unique time-out
  if (!unique) {
      return new Promise(resolve => {
        window.setTimeout(() => {
          if (!isCallable(callback)) {
            throw 'cannot execute timeout, no callback-function given.'
          }

          callback();
          if (isCallable(then)) {
            then();
          }
          resolve();
        }, duration);
      });
  }

  // attach an callback to existing time-out-promise
  if (!callback && isCallable(then)) {
    return (promise)
      ? promise.then(() => then())
      : then();
  }

  // CORE: make an unique time-out
  promise = new Promise(resolve => {
    if (q !== null) {
      window.clearTimeout(q);
      q = null;
    }

    q = window.setTimeout(() => {
      if (!isCallable(callback)) {
        throw 'cannot execute timeout, no callback-function given.'
      }

      let result = callback();

      if (isCallable(then)) {
        then();
      }

      resolve(result);
      promise = null;
    }, (isCallable(duration)) ? duration() : duration);
  });

  return promise;
};


/**
 * Returns true, when given parameter is a function
 */
export const isCallable = (callable) => (callable && callable.constructor === Function);
