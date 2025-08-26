"use client";
import React from "react";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { actions } from "@/data/actions";
import { type ProfileImageFormState } from "@/data/validation/profile";
import { TImage } from "@/types";

import { SubmitButton } from "@/components/custom/submit-button";
import ImagePicker from "@/components/custom/image-picker";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

interface IProfileImageFormProps {
  image?: TImage | null;
}

const INITIAL_STATE: ProfileImageFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileImageForm({
  image,
  className,
}: IProfileImageFormProps & {
  className?: string;
}) {
  const [formState, formAction] = useActionState(
    actions.profile.updateProfileImageAction,
    INITIAL_STATE
  );

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <input
          hidden
          id="id"
          name="id"
          defaultValue={image?.documentId || ""}
        />
        <ImagePicker
          id="image"
          name="image"
          label="Profile Image"
          defaultValue={image?.url || ""}
        />
        <ZodErrors error={formState?.zodErrors?.image} />
        <StrapiErrors error={formState?.strapiErrors} />
      </div>
      <div className="flex justify-end">
        <SubmitButton text="Update Image" loadingText="Saving Image" />
      </div>
    </form>
  );
}