import debounce from "lodash/debounce";

const debounceMiddleware = (
  defaults = { wait: 5000, options: { leading: true, trailing: false } },
) => {
  const debouncers = {};
  return () => next => action => {
    const _debounce = action.meta?.debounce;
    if (!_debounce) return next(action);

    let wait, key, options;
    if (typeof _debounce === "number") {
      wait = _debounce;
      key = action.type;
      options = defaults.options;
    } else {
      wait = isNaN(_debounce.wait) ? defaults.wait : _debounce.wait;
      key = _debounce.key || action.type;
      options = _debounce || defaults.options;
    }
    let debouncer = debouncers[key];
    if (!debouncer) {
      debouncer = debounce(next, wait, options);
      debouncers[key] = debouncer;
    }
    return debouncer(action);
  };
};

export default debounceMiddleware;
