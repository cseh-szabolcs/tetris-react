
/**
 * helper to call the window.setTimeout which supports unique timeouts
 *
 */

let q = null;

export default ({callback, duration = 200, than = null, clear = false}) => {
  if (clear === true) {
    if (q !== null) {
      window.clearTimeout(q);
      q = null;
    }
    return;
  }

  return new Promise((resolve, reject) => {
    if (q !== null) {
      window.clearTimeout(q);
      q = null;
    }

    q = window.setTimeout(() => {
      if (!isCallable(callback)) {
        throw 'cannot execute timeout, no callback-function given.'
      }

      let result = callback();

      if (isCallable(than)) {
        than();
      }

      resolve(result);
    }, (isCallable(duration)) ? duration() : duration);
  });
};


/**
 * Returns true, when given parameter is a function
 */
export const isCallable = (callable) => (callable && callable.constructor === Function);
