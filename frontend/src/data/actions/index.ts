import {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
  getAuthTokenAction,
} from "./auth";
import { updateProfileAction, updateProfileImageAction } from "./profile";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
  profile: {
    updateProfileAction,
    updateProfileImageAction,
  },
};