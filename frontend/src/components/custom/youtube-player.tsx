"use client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

interface IYouTubePlayerProps {
  videoId: string;
}

const styles = {
  container: "relative w-full h-[315px] rounded-lg overflow-hidden",
  skeletonWrapper: "absolute inset-0 w-full h-full",
  skeleton: "w-full h-full animate-pulse",
  iconContainer: "absolute inset-0 flex items-center justify-center",
  playIcon: "w-16 h-16 text-gray-400 animate-bounce",
  iframe: "rounded-lg",
};

export function YouTubePlayer({ videoId }: IYouTubePlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.container}>
      {!isLoaded && (
        <div className={styles.skeletonWrapper}>
          <Skeleton className={styles.skeleton} />
          <div className={styles.iconContainer}>
            <Play className={styles.playIcon} fill="currentColor" />
          </div>
        </div>
      )}
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={styles.iframe}
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </div>
  );
}