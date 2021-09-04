import { combineReducers } from "redux";
import global from "./global";
import auth from "./auth";
import grid from "./grid";

export default combineReducers({
  global,
  auth,
});
