"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState, forwardRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const MDXEditorClient = dynamic(() => import("./mdx-editor-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[350px] rounded-md border background-light500_dark200 text-light-700_dark300 p-4">
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  ),
}) as React.ComponentType<
  MDXEditorProps & { editorRef?: React.Ref<MDXEditorMethods> }
>;

interface EditorWrapperProps {
  markdown?: string;
  onChange?: (markdown: string) => void;
  className?: string;
}

export function EditorWrapper({
  markdown = "",
  onChange,
  className,
}: EditorWrapperProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasError(false);
    }
  }, []);

  if (hasError) {
    return (
      <Alert
        variant="destructive"
        className="min-h-[350px] flex items-center justify-center"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load the editor. Please refresh the page to try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <MDXEditorClient
      markdown={markdown}
      onChange={onChange}
      className={className}
    />
  );
}

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <MDXEditorClient {...props} editorRef={ref} />
);

ForwardRefEditor.displayName = "ForwardRefEditor";

export default EditorWrapper;