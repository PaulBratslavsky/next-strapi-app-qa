import { Params } from "@/types";
import { loaders } from "@/data/loaders";
import { extractYouTubeID } from "@/lib/utils";
import { validateApiResponse } from "@/lib/error-handler";
import { notFound } from "next/navigation";
import { YouTubePlayer } from "@/components/custom/youtube-player";
import { SummaryUpdateForm } from "@/components/forms/summary-update-form"

interface IPageProps {
  params: Params;
}

export default async function SummarySingleRoute({ params }: IPageProps) {
  const resolvedParams = await params;
  const documentId = resolvedParams?.documentId;

  if (!documentId) notFound();

  const data = await loaders.getSummaryByDocumentId(documentId);
  const summary = validateApiResponse(data, "summary");
  const videoId = extractYouTubeID(summary.videoId);

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3 h-full">
          <SummaryUpdateForm summary={summary}/>
        </div>
        <div className="col-span-2">
          <div>
            {videoId ? (
              <YouTubePlayer videoId={videoId} />
            ) : (
              <p>Invalid video URL</p>
            )}
            <h1 className="text-2xl font-bold mt-4">{summary.title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
