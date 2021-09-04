import { createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
import axios from "axios";

const parseError = err => (err.response && err.response.data) || err.message || err.toString();

// Returns generic async thunk action for axios requests
export const requestThunk = (
  entity = "",
  method = "",
  { altMethodName = "", config = {}, meta = {}, axiosInstance, onSuccess, onError } = {},
) => {
  const type = `${entity.toLowerCase()}/${(altMethodName || method).toLowerCase()}`;

  const func = async (args = {}, { fulfillWithValue, rejectWithValue, signal }) => {
    if (!config.url) config.url = `${entity}/`;

    const source = axios.CancelToken.source();
    signal.addEventListener("abort", () => {
      source.cancel();
    });

    const _config = {
      method,
      cancelToken: source.token,
      ...config,
      ...args,
    };

    return await (axiosInstance || axios)
      .request(_config)
      .then(res => {
        let fulfill = res.data;
        if (onSuccess) fulfill = onSuccess(res);
        return fulfillWithValue(fulfill, meta);
      })
      .catch(err => {
        let reject = parseError(err);
        if (onError) reject = onError(err);
        throw rejectWithValue(reject, meta);
      });
  };

  return createAsyncThunk(type, func, {
    // Preventing simultaneous pending requests of the same type
    condition: (args, { getState }) => {
      const { stack } = getState().global;
      if (Object.values(stack).includes([type, "pending"])) {
        return false;
      }
    },
  });
};

// Returns programmatically generated actions and extra reducers
export const createActions = (
  entity,
  { methods = [], actions = {}, reducers = {}, requestArgs = {} } = {},
) => {
  let _actions = {};
  let _reducers = reducers;
  // Creating actions for methods
  methods.forEach(method => {
    _actions[method] = requestThunk(entity, method, { ...requestArgs });
  });
  // Creating actions for actions argument
  if (!_.isEmpty(actions))
    for (const [k, v] of Object.entries(actions)) {
      let [entity, method, extraArgs] = v;
      if (!extraArgs) extraArgs = {};
      extraArgs.meta = { ...requestArgs.meta, ...extraArgs.meta };
      extraArgs = { ...requestArgs, ...extraArgs };
      _actions[k] = requestThunk(entity, method, extraArgs);
    }
  // Creating reducers for actions
  for (const action of Object.values(_actions)) {
    if (!_reducers[action]) {
      _reducers[action.fulfilled] = (state, { payload, meta }) => {
        const { message, ...data } = payload;
        state.data = meta.overwrite ? data : { ...state.data, ...data };
        state.message = message;
      };
      _reducers[action.rejected] = (state, { payload }) => {
        state.message = payload;
      };
    } else {
      console.warn(
        `'${action}' action's reducers are already in extra reducers. They will not be overwritten.`,
      );
    }
  }
  return [_actions, _reducers];
};
