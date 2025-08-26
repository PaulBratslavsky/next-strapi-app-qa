"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { actions } from "@/data/actions";
import { useActionState } from "react";
import type { ProfileFormState } from "@/data/validation/profile";

import type { TAuthUser } from "@/types";

import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

const styles = {
  form: "space-y-4",
  container: "space-y-4 grid",
  topRow: "grid grid-cols-3 gap-4",
  nameRow: "grid grid-cols-2 gap-4",
  fieldGroup: "space-y-2",
  textarea: "resize-none border rounded-md w-full h-[224px] p-2",
  buttonContainer: "flex justify-end",
  countBox:
    "flex items-center justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
  creditText: "font-bold text-md mx-1",
};

interface IProfileFormProps {
  user?: TAuthUser | null;
}

const INITIAL_STATE: ProfileFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileForm({
  user,
  className,
}: IProfileFormProps & {
  readonly className?: string;
}) {
  const [formState, formAction] = useActionState(
    actions.profile.updateProfileAction,
    INITIAL_STATE
  );
  if (!user) {
    return (
      <div className={cn(styles.form, className)}>
        <p>Unable to load profile data</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(styles.form, className)}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            defaultValue={user.username || ""}
            disabled
          />
          <Input
            id="email"
            name="email"
            placeholder="Email"
            defaultValue={user.email || ""}
            disabled
          />
          <CountBox text={user.credits || 0} />
        </div>

        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              defaultValue={formState?.data?.firstName || user.firstName || ""}
            />
            <ZodErrors error={formState?.zodErrors?.firstName} />
          </div>
          <div className={styles.fieldGroup}>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              defaultValue={formState?.data?.lastName || user.lastName || ""}
            />
            <ZodErrors error={formState?.zodErrors?.lastName} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Write your bio here..."
            className={styles.textarea}
            defaultValue={formState?.data?.bio || user.bio || ""}
          />
          <ZodErrors error={formState?.zodErrors?.bio} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <SubmitButton text="Update Profile" loadingText="Saving Profile" />
      </div>
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}

function CountBox({ text }: { text: number }) {
  const color = text > 0 ? "text-primary" : "text-red-500";
  return (
    <div className={styles.countBox}>
      You have<span className={cn(styles.creditText, color)}>{text}</span>
      credit(s)
    </div>
  );
}