"use server";
import { z } from "zod";

import { services } from "@/data/services";

import {
  ProfileFormSchema,
  ProfileImageFormSchema,
  type ProfileFormState,
  type ProfileImageFormState,
} from "@/data/validation/profile";
export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {

  const fields = Object.fromEntries(formData);

  console.dir(fields);

  const validatedFields = ProfileFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const responseData = await services.profile.updateProfileService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (responseData.error) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  return {
    success: false,
    message: "Successfully updated form",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}

export async function updateProfileImageAction(
  prevState: ProfileImageFormState,
  formData: FormData
): Promise<ProfileImageFormState> {

  // Get current user
  const user = await services.auth.getUserMeService();
  if (!user.success || !user.data) {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
      strapiErrors: null,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const currentImageId = user.data.image?.id;

  const image = formData.get("image") as File;

  if (!image || image.size === 0) {
    return {
      success: false,
      message: "No image provided",
      strapiErrors: null,
      zodErrors: { image: ["Image is required"] },
      data: prevState.data,
    };
  }

  const validatedFields = ProfileImageFormSchema.safeParse({ image });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: prevState.data,
    };
  }

  // Delete previous image if exists
  if (currentImageId) {
    console.log(currentImageId);
    try {
      await services.file.fileDeleteService(currentImageId);
    } catch (error) {
      console.error("Failed to delete previous image:", error);
      // Continue with upload even if delete fails
    }
  }

  // Upload new image to media library
  const fileUploadResponse = await services.file.fileUploadService(
    validatedFields.data.image
  );

  if (!fileUploadResponse.success || !fileUploadResponse.data) {
    return {
      success: false,
      message: "Failed to upload image",
      strapiErrors: fileUploadResponse.error,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const uploadedImageId = fileUploadResponse.data[0].id;

  // Update user profile with new image
  const updateImageResponse = await services.profile.updateProfileImageService(
    uploadedImageId
  );

  if (!updateImageResponse.success) {
    return {
      success: false,
      message: "Failed to update profile with new image",
      strapiErrors: updateImageResponse.error,
      zodErrors: null,
      data: prevState.data,
    };
  }

  return {
    success: true,
    message: "Profile image updated successfully",
    strapiErrors: null,
    zodErrors: null,
    data: {
      image: validatedFields.data.image,
    },
  };
}