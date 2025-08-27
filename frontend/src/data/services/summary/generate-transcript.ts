import { 
  TranscriptData, 
  TranscriptSegment, 
  YouTubeTranscriptSegment,
  YouTubeAPIVideoInfo 
} from "./types";

const processTranscriptSegments = (segments: YouTubeTranscriptSegment[]): TranscriptSegment[] => {
  return segments.map((segment) => ({
    text: segment.snippet.text,
    start: Number(segment.start_ms),
    end: Number(segment.end_ms),
    duration: Number(segment.end_ms) - Number(segment.start_ms),
  }));
};

const cleanImageUrl = (url: string): string => url.split('?')[0];

const validateIdentifier = (identifier: string): void => {
  if (!identifier || typeof identifier !== 'string') {
    throw new Error('Invalid YouTube video identifier');
  }
};

const extractBasicInfo = (info: YouTubeAPIVideoInfo) => {
  const { title, id: videoId, thumbnail } = info.basic_info;
  const thumbnailUrl = thumbnail?.[0]?.url;
  
  return {
    title: title || 'Untitled Video',
    videoId,
    thumbnailUrl: thumbnailUrl ? cleanImageUrl(thumbnailUrl) : undefined,
  };
};

const getTranscriptSegments = async (info: YouTubeAPIVideoInfo): Promise<YouTubeTranscriptSegment[]> => {
  const transcriptData = await info.getTranscript();
  
  if (!transcriptData?.transcript?.content?.body?.initial_segments) {
    throw new Error('No transcript available for this video');
  }

  return transcriptData.transcript.content.body.initial_segments;
};

export const generateTranscript = async (identifier: string): Promise<TranscriptData> => {
  try {
    const { Innertube } = await import('youtubei.js');
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    });


    validateIdentifier(identifier);

    const info = await youtube.getInfo(identifier);

    if (!info) {
      throw new Error('No video information found');
    }

    const { title, videoId, thumbnailUrl } = extractBasicInfo(info as YouTubeAPIVideoInfo);
    const segments = await getTranscriptSegments(info as YouTubeAPIVideoInfo);
    const transcriptWithTimeCodes = processTranscriptSegments(segments);
    const fullTranscript = segments.map(segment => segment.snippet.text).join(' ');

    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript,
      transcriptWithTimeCodes,
    };
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch transcript'
    );
  }
};