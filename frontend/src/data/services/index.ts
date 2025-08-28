import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";

import { updateProfileService, updateProfileImageService } from "./profile";
import { fileUploadService, fileDeleteService } from "./file";

import { generateTranscript, generateSummary, saveSummaryService, updateSummaryService, deleteSummaryService } from "./summary";

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
  summarize: {
    generateTranscript,
    generateSummary,
    saveSummaryService,
    updateSummaryService,
    deleteSummaryService,
  },
};
