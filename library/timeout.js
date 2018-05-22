
/**
 * helper to call the window.setTimeout which supports unique timeouts
 *
 */

let q = null, promise = null;

export default ({callback, duration = 200, then = null, clear = false}) => {
  if (clear === true) {
    if (q !== null) {
      window.clearTimeout(q);

      q = null;
    }
    return;
  }

  if (!callback && isCallable(then)) {
    return (promise)
      ? promise.then(() => then())
      : then();
  }

  promise = new Promise((resolve, reject) => {
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
