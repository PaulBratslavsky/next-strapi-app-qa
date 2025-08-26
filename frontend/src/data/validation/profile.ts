import { z } from "zod";

export const ProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export type ProfileFormState = {
  success?: boolean;
  message?: string;
  data?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    firstName?: string[];
    lastName?: string[];
    bio?: string[];
  } | null;
};

export const ProfileImageFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required")
    .refine((file) => file.size <= 5000000, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Image must be JPEG, PNG, or WebP format"
    ),
});

export type ProfileImageFormValues = z.infer<typeof ProfileImageFormSchema>;

export type ProfileImageFormState = {
  success?: boolean;
  message?: string;
  data?: {
    image?: File;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    image?: string[];
  } | null;
};