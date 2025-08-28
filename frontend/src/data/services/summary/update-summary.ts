import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TSummary } from "@/types";
import { api } from "@/data/data-api";
import { actions } from "@/data/actions";

const baseUrl = getStrapiURL();

export async function updateSummaryService(
  documentId: string, 
  summaryData: Partial<TSummary>
): Promise<TStrapiResponse<TSummary>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const query = qs.stringify({
    populate: "*",
  });

  const url = new URL(`/api/summaries/${documentId}`, baseUrl);
  url.search = query;
  
  // Strapi expects data to be wrapped in a 'data' object
  const payload = { data: summaryData };
  const result = await api.put<TSummary, typeof payload>(url.href, payload, { authToken });
  
  console.log("######### actual update summary response");
  console.dir(result, { depth: null });
  
  return result;
}