import { registerUserAction, loginUserAction, logoutUserAction, getAuthTokenAction } from "./auth";

export const actions = {
    auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
};
