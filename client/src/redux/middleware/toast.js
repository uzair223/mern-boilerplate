import { toast } from "react-toastify";

const toastMiddleware = () => next => action => {
  if (action.meta?.toast)
    action.error
      ? toast.error(action.payload?.message || action.payload || action.error?.message)
      : toast.success(action.payload?.message);
  return next(action);
};

export default toastMiddleware;
