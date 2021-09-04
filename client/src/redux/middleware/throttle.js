import throttle from "lodash/throttle";

const throttleMiddleware = (
  defaults = { wait: 5000, options: { leading: true, trailing: false } },
) => {
  const throttlers = {};
  return () => next => action => {
    const _throttle = action.meta?.throttle;
    if (!_throttle) return next(action);

    let wait, key, options;
    if (typeof _throttle === "number") {
      wait = _throttle;
      key = action.type;
      options = defaults.options;
    } else {
      wait = isNaN(_throttle.wait) ? defaults.wait : _throttle.wait;
      key = _throttle.key || action.type;
      options = _throttle || defaults.options;
    }
    let throttler = throttlers[key];
    if (!throttler) {
      throttler = throttle(next, wait, options);
      throttlers[key] = throttler;
    }
    return throttler(action);
  };
};

export default throttleMiddleware;
