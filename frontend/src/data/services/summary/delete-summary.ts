import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse } from "@/types";
import { api } from "@/data/data-api";
import { actions } from "@/data/actions";

const baseUrl = getStrapiURL();

export async function deleteSummaryService(documentId: string): Promise<TStrapiResponse<null>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const url = new URL(`/api/summaries/${documentId}`, baseUrl);
  
  const result = await api.delete<null>(url.href, { authToken });
  
  console.log("######### actual delete summary response");
  console.dir(result, { depth: null });
  
  return result;
}