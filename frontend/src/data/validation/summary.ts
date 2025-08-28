import { z } from "zod";

export const SummaryUpdateFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  documentId: z.string().min(1, "Document ID is required"),
});

export type SummaryUpdateFormValues = z.infer<typeof SummaryUpdateFormSchema>;

export type SummaryUpdateFormState = {
  success?: boolean;
  message?: string;
  data?: {
    title?: string;
    content?: string;
    documentId?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    title?: string[];
    content?: string[];
    documentId?: string[];
  } | null;
};

export const SummaryDeleteFormSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});

export type SummaryDeleteFormValues = z.infer<typeof SummaryDeleteFormSchema>;

export type SummaryDeleteFormState = {
  success?: boolean;
  message?: string;
  data?: {
    documentId?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    documentId?: string[];
  } | null;
};