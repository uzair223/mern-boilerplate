import { createReducer as _createReducer } from "@reduxjs/toolkit";
import { createActions } from "redux/actions";

const createReducer = (entity, { methods, actions, reducers, requestArgs }) => {
  const [Actions, Reducers] = createActions(entity, { methods, actions, reducers, requestArgs });
  const reducer = _createReducer(
    {
      status: "idle",
      data: {},
      message: null,
    },
    Reducers,
  );
  return [reducer, Actions];
};

export default createReducer;
