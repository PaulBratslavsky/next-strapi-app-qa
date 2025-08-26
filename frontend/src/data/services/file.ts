import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse } from "@/types";
import { actions } from "@/data/actions";

const baseUrl = getStrapiURL();

type TImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

type TFileUploadResponse = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: Record<string, TImageFormat> | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export async function fileUploadService(
  file: File
): Promise<TStrapiResponse<TFileUploadResponse[]>> {
  const authToken = await actions.auth.getAuthTokenAction();

  if (!authToken) {
    return {
      success: false,
      data: undefined,
      error: {
        status: 401,
        name: "AuthError",
        message: "No auth token found",
      },
      status: 401,
    };
  }

  const url = new URL("/api/upload", baseUrl);
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("File upload error:", data);
      return {
        success: false,
        data: undefined,
        error: {
          status: response.status,
          name: data?.error?.name ?? "UploadError",
          message: data?.error?.message ?? "Failed to upload file",
        },
        status: response.status,
      };
    }

    return {
      success: true,
      data: data,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.error("File upload service error:", error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Upload failed",
      },
      status: 500,
    };
  }
}

export async function fileDeleteService(
  fileId: number
): Promise<TStrapiResponse<boolean>> {
  const authToken = await actions.auth.getAuthTokenAction();

  if (!authToken) {
    return {
      success: false,
      data: undefined,
      error: {
        status: 401,
        name: "AuthError",
        message: "No auth token found",
      },
      status: 401,
    };
  }

  const url = new URL(`/api/upload/files/${fileId}`, baseUrl);

  try {
    const response = await fetch(url.href, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("File delete error:", data);
      return {
        success: false,
        data: undefined,
        error: {
          status: response.status,
          name: data?.error?.name ?? "DeleteError",
          message: data?.error?.message ?? "Failed to delete file",
        },
        status: response.status,
      };
    }

    return {
      success: true,
      data: true,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.error("File delete service error:", error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Delete failed",
      },
      status: 500,
    };
  }
}