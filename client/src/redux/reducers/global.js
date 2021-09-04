import { createAction, createReducer } from "@reduxjs/toolkit";

const resetAction = createAction("reset-tracked-state");
const initialState = { status: "idle", stack: {} };

export default createReducer(initialState, builder => {
  builder
    .addCase("error", state => {
      state.status = "rejected";
    })
    .addCase(resetAction, () => initialState)
    // Pending actions
    .addMatcher(
      action => action.type.endsWith("/pending"),
      (state, action) => {
        state.status = "pending";
        state.stack[action.meta.requestId] = [action.type.replace("/pending", ""), "pending"];
      },
    )
    // Rejected actions
    .addMatcher(
      action => action.type.endsWith("/rejected"),
      (state, action) => {
        state.status = action.meta.noGlobalReject ? "idle" : "rejected";
        state.stack[action.meta.requestId] = [action.type.replace("/rejected", ""), "rejected"];
      },
    )
    // Fulfilled actions
    .addMatcher(
      action => action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.status = "idle";
        state.stack[action.meta.requestId] = [action.type.replace("/fulfilled", ""), "fulfilled"];
      },
    );
});
