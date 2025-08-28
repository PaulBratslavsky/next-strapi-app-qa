import {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
  getAuthTokenAction,
} from "./auth";
import { updateProfileAction, updateProfileImageAction } from "./profile";
import { updateSummaryAction, deleteSummaryAction } from "./summary";

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
  summary: {
    updateSummaryAction,
    deleteSummaryAction,
  },
};