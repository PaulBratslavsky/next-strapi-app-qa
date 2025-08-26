import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";

import { updateProfileService, updateProfileImageService } from "./profile";
import { fileUploadService, fileDeleteService } from "./file";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
    updateProfileImageService,
  },
  file: {
    fileUploadService,
    fileDeleteService,
  },
};