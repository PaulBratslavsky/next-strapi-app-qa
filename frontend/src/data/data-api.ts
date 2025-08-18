import type { TStrapiResponse } from "@/types";
// import { actions } from "@/data/actions";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiOptions<P = Record<string, unknown>> = {
  method: HTTPMethod;
  payload?: P;
  timeoutMs?: number;
};

/**
 * Unified API function with timeout to prevent requests from hanging indefinitely
 * 
 * Problem it solves:
 * - Slow/broken servers can cause requests to hang forever
 * - This blocks the UI and creates poor user experience
 * - Manual fetch implementations scattered across the codebase
 * - Inconsistent error handling and authentication patterns
 * 
 * How it works:
 * - Single function handles all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication - checks for auth token and includes it if available
 * - AbortController ensures requests complete within reasonable timeframe
 * - Consistent error formatting for all request types
 * - Special handling for DELETE requests that may not return JSON
 * 
 * Features:
 * - Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Automatic authentication (auto-adds Bearer token when available)
 * - Timeout protection (8 seconds default)
 * - Consistent error handling and response formatting
 * - Handles DELETE requests without response body parsing
 */

async function apiWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 8000 // 8 seconds default - good balance between patience and UX
): Promise<Response> {
  // Create controller to manage request cancellation
  const controller = new AbortController();
  
  // Set up automatic cancellation after timeout period
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal, // Connect the abort signal to fetch
    });
    return response;
  } finally {
    // Always clean up the timeout to prevent memory leaks
    // This runs whether the request succeeds, fails, or times out
    clearTimeout(timeout);
  }
}

export async function apiRequest<T = unknown, P = Record<string, unknown>>(
  url: string,
  options: ApiOptions<P>
): Promise<TStrapiResponse<T>> {
  const { method, payload, timeoutMs = 8000 } = options;

  // Set up base headers for JSON communication
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Automatically check for auth token and include it if available
  // Note: This only works in server-side contexts (server components, server actions)
  // For client-side usage, consider using server actions instead
  // let authToken: string | undefined;
  // try {
  //   authToken = await actions.auth.getAuthTokenAction();
  // } catch {
  //   // getAuthTokenAction is a server action and will fail on client-side
  //   console.warn("Cannot access auth token from client-side. Use server actions for authenticated requests.");
  //   authToken = undefined;
  // }
  
  // if (authToken) {
  //   headers["Authorization"] = `Bearer ${authToken}`;
  // }

  try {
    // Make the actual API request with timeout protection
    const response = await apiWithTimeout(url, {
      method,
      headers,
      // GET and DELETE requests don't have request bodies
      body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(payload ?? {}),
    }, timeoutMs);

    // Handle DELETE requests that may not return JSON response body
    if (method === "DELETE") {
      return response.ok
        ? { data: true as T, success: true, status: response.status }
        : {
            error: {
              status: response.status,
              name: "Error",
              message: "Failed to delete resource",
            },
            success: false,
            status: response.status,
          };
    }

    // Parse the JSON response for all other methods
    const data = await response.json();

    // Handle unsuccessful responses (4xx, 5xx status codes)
    if (!response.ok) {
      console.error(`API ${method} error (${response.status}):`, {
        url,
        status: response.status,
        statusText: response.statusText,
        data,
        // hasAuthToken: !!authToken
      });
      
      // If Strapi returns a structured error, pass it through as-is
      if (data.error) {
        return {
          error: data.error,
          success: false,
          status: response.status,
        };
      }
      
      // Otherwise create a generic error response
      return {
        error: {
          status: response.status,
          name: data?.error?.name ?? "Error",
          message: data?.error?.message ?? (response.statusText || "An error occurred"),
        },
        success: false,
        status: response.status,
      };
    }

    // Success case - extract Strapi data field to avoid double nesting
    // Strapi returns: { data: {...}, meta: {...} }
    // We want to return: { data: {...}, meta: {...}, success: true, status: 200 }
    const responseData = data.data ? data.data : data;
    const responseMeta = data.meta ? data.meta : undefined;
    return { 
      data: responseData as T, 
      meta: responseMeta,
      success: true, 
      status: response.status 
    };
  } catch (error) {
    // Handle timeout errors specifically (when AbortController cancels the request)
    if ((error as Error).name === "AbortError") {
      console.error("Request timed out");
      return {
        error: {
          status: 408,
          name: "TimeoutError",
          message: "The request timed out. Please try again.",
        },
        success: false,
        status: 408,
      } as TStrapiResponse<T>;
    }

    // Handle network errors, JSON parsing errors, and other unexpected issues
    console.error(`Network or unexpected error on ${method} ${url}:`, error);
    return {
      error: {
        status: 500,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Something went wrong",
      },
      success: false,
      status: 500,
    } as TStrapiResponse<T>;
  }
}

/**
 * Convenience API methods for common HTTP operations
 * 
 * Usage examples:
 * 
 * // Public endpoints (work without authentication)
 * const homePage = await api.get<THomePage>('/api/home-page');
 * const authResult = await api.post<TAuthResponse, TLoginData>('/api/auth/local', loginData);
 * 
 * // Protected endpoints (automatically include auth token when available)
 * const userProfile = await api.get<TUser>('/api/users/me');
 * const updated = await api.put<TUser, TProfileData>('/api/users/123', profileData);
 * const deleted = await api.delete<boolean>('/api/posts/456');
 */
export const api = {
  // GET request - for fetching data
  get: <T>(url: string, timeoutMs?: number) => 
    apiRequest<T>(url, { method: "GET", timeoutMs }),
  
  // POST request - for creating new resources
  post: <T, P = Record<string, unknown>>(url: string, payload: P, timeoutMs?: number) => 
    apiRequest<T, P>(url, { method: "POST", payload, timeoutMs }),
  
  // PUT request - for updating entire resources
  put: <T, P = Record<string, unknown>>(url: string, payload: P, timeoutMs?: number) => 
    apiRequest<T, P>(url, { method: "PUT", payload, timeoutMs }),
  
  // PATCH request - for partial updates
  patch: <T, P = Record<string, unknown>>(url: string, payload: P, timeoutMs?: number) => 
    apiRequest<T, P>(url, { method: "PATCH", payload, timeoutMs }),
  
  // DELETE request - for removing resources
  delete: <T>(url: string, timeoutMs?: number) => 
    apiRequest<T>(url, { method: "DELETE", timeoutMs }),
};