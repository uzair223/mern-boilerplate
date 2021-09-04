import axios from "axios";
axios.defaults.baseURL = "http://localhost:9000";
axios.defaults.withCredentials = true;

const authAxios = axios.create();

export const AxiosInterceptors = {
  setup: (store, authActions) => {
    authAxios.interceptors.request.use(
      async config => {
        let access_token = await store.getState().auth.data.access_token;
        config.headers = {
          "Authorization": `Bearer ${access_token}`,
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        };
        return config;
      },
      error => Promise.reject(error),
    );
    // Refresh access token on Unauthorized error (status code 401)
    authAxios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const promise = await store.dispatch(authActions.get());
          if (promise.error) return Promise.reject(promise.payload);
          return authAxios(originalRequest);
          // Token will be injected in request interceptor
        }
        return Promise.reject(error);
      },
    );
  },
};

export default authAxios;
