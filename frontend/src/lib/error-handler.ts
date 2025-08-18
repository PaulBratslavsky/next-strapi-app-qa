import { notFound } from "next/navigation";
import type { TStrapiResponse } from "@/types";

/**
 * Handles API response errors consistently across all routes
 * 
 * @param data - The API response data
 * @param resourceName - Optional name of the resource for better error messages (e.g., "summary", "user")
 * @throws Error when the response indicates failure (non-404 errors)
 * @returns void - Function either succeeds silently or throws/redirects
 */
export function handleApiError<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): void {
  if (!data) {
    throw new Error(`Failed to load ${resourceName || "resource"}`);
  }

  // Handle 404 errors specifically with notFound()
  if (data?.error?.status === 404) {
    notFound();
  }

  // Handle all other API errors
  if (!data?.success || !data?.data) {
    const errorMessage = data?.error?.message || `Failed to load ${resourceName || "resource"}`;
    throw new Error(errorMessage);
  }
}

/**
 * Validates and extracts data from API response, handling errors automatically
 * 
 * @param data - The API response data
 * @param resourceName - Optional name of the resource for better error messages
 * @returns The extracted data from the response
 * @throws Error when the response indicates failure
 */
export function validateApiResponse<T>(
  data: TStrapiResponse<T> | null | undefined,
  resourceName?: string
): T {
  handleApiError(data, resourceName);
  return data!.data!;
}