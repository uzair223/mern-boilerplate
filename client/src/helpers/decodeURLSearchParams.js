import _ from "lodash";

const decodeURLSearchParams = (urlSearchParams = new URLSearchParams()) => {
  const decoded = {};
  const params = Object.fromEntries(urlSearchParams.entries());
  if (_.isEmpty(params)) return;

  for (let [k, v] of Object.entries(params)) {
    v = v || "";
    if (_.has(decoded, k)) {
      const current = _.get(decoded, k);
      if (!Array.isArray(current)) {
        _.set(decoded, k, [current, v]);
      } else {
        current.push(v);
      }
    } else {
      _.set(decoded, k, v);
    }
  }
  return decoded;
};

export default decodeURLSearchParams;
