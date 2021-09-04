import createReducer from "./_createReducer";
import { createActions } from "../actions";
import authAxios from "helpers/axios";

// user
const [userActions, userReducers] = createActions("user", {
  methods: ["get", "put", "delete"],
  requestArgs: {
    axiosInstance: authAxios,
  },
});
// access token
const actions = {
  login: ["auth/login", "post"],
  register: ["auth/register", "post"],
  verify: ["auth/register", "get", { altMethodName: "verify" }],
  revoke: [
    "auth/token",
    "get",
    { config: { url: "auth/token/revoke" }, altMethodName: "revoke", meta: { overwrite: true } },
  ],
  get: ["auth/token", "get", { meta: { toast: false, noGlobalReject: true } }],
};
const [authReducer, authActions] = createReducer("token", {
  actions,
  requestArgs: { meta: { toast: true } },
  reducers: {
    "auth/token/set": (state, { payload }) => {
      state.data = { ...state.data, access_token: payload };
    },
    ...userReducers,
  },
});

export { authActions, userActions };
export default authReducer;
