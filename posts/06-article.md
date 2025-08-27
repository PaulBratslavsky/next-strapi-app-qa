In the previous tutorial, we completed our **Dashboard** and **Account** pages. In this section, we'll build a video summary feature using the [AI SDK from Vercel](https://ai-sdk.dev).

- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-14-tutorial-learn-next-js-by-building-a-real-life-project-part-1-2)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-14-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finish up up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-14-tutorial-learn-next-js-by-building-a-real-life-project-part-3)
- [Part 4: How to handle login and Authentication in Next.js](https://strapi.io/blog/epic-next-js-14-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: File upload using server actions](https://strapi.io/blog/epic-next-js-14-tutorial-part-5-file-upload-using-server-actions)
- **Part 6: Generate Video Summaries with AI**
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-14-tutorial-part-7-next-js-and-strapi-crud-permissions)
- [Part 8: Search & pagination in Nextjs](https://strapi.io/blog/epic-next-js-14-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-14-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-14-tutorial-part-10-frontend-deployment-to-vercel)

![Screenshot 2025-08-27 at 11.23.28 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_11_23_28_AM_7147bda212.png)

We'll start by building a `SummaryForm` component. Instead of server actions, we'll use Next.js API routes for backend logic.

Learn more about [Next.js route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## Creating the Summary Form

First, let's create our summary form component.

Navigate to `src/components/forms` and create `summary-form.tsx` with this starter code:

```tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

type ITranscriptResponse = {
  fullTranscript: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
};

interface IErrors {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;
    const processedVideoId = extractYouTubeID(videoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id",
      });
      return;
    }

    let currentToastId: string | number | undefined;

    try {
      // Step 1: Get transcript
      currentToastId = toast.loading("Getting transcript...");

      // Step 2: Generate summary
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Generating summary...");

      // Step 3: Save summary to database
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Saving summary...");

      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
    } catch (error) {
      if (currentToastId) toast.dismiss(currentToastId);
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create summary"
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full">
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          className="bg-pink-500"
          loading={loading}
        />
      </form>
    </div>
  );
}
```

The above code contains a basic form UI and a `handleFormSubmit` function, which does not include any of our logic to get the summary yet.

We also use **Sonner**, one of my favorite toast libraries. You can learn more about it [here](https://sonner.emilkowal.ski/).

But we are not using it directly; instead, we are using the **Chadcn UI** component, which you can find [here](https://ui.shadcn.com/docs/components/sonner).

```bash
npx shadcn@latest add sonner
```

Once **Sonner** is installed, implement it in our main `layout.tsx` file by adding the following import.

```tsx
import { Toaster } from "@/components/ui/sonner";
```

And adding the code below above our `TopNav`.

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <Toaster position="bottom-center" />
  <Header data={globalData.data.header} />
  {children}
  <Footer data={globalData.data.footer} />
</body>
```

Before adding this component to our top navigation, notice that we expect `extractYouTubeID` helper method, let's add the following in our `utils.ts` file found in our `lib` folder and add the following code:

```ts
export function extractYouTubeID(urlOrID: string): string | null {
  // Regular expression for YouTube ID format
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // Check if the input is a YouTube ID
  if (regExpID.test(urlOrID)) {
    return urlOrID;
  }

  // Regular expression for standard YouTube links
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // Regular expression for YouTube Shorts links
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // Check for standard YouTube link
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
    return matchStandard[1];
  }

  // Check for YouTube Shorts link
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
    return matchShorts[1];
  }

  // Return null if no match is found
  return null;
}
```

Now we can go ahead and add this form to our top navigation by navigating to the `src/components/custom/header.tsx` file and making the following changes.

```tsx
// import the form
import { SummaryForm } from "@/components/forms/summary-form";

// rest of the code

export async function Header({ data }: Readonly<HeaderProps>) {
  const { logoText, ctaButton } = data;
  const user = await getUserMeLoader();

  return (
    <div className={styles.header}>
      <Logo text={logoText.label} />
      {user.success && <SummaryForm />}
      <div className={styles.actions}>
        {user.success && user.data ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={ctaButton.href}>
            <Button>{ctaButton.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
```

Let's restart our frontend project and see if it shows up.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_articles_demo_form_start_013a6f9061.mp4">
  Your browser does not support the video tag.
</video>

Now that our basic form is working let's examine how to set up our first API Handler Route in Next.js 15.

## How To Create A Route Handler in Next.js 15

We will have the Next.js [docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) open as a reference.

Let's start by creating a new folder inside our `app` directory called `api`, a folder called `transcript`, and a file called `route.ts`. Then, paste in the following code.

```ts
import { NextRequest } from "next/server";
import { actions } from "@/data/actions";
import { services } from "@/data/services";

export const maxDuration = 150;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await services.auth.getUserMeService();
  const token = await actions.auth.getAuthTokenAction();

  if (!user.success || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  const body = await req.json();
  const videoId = body.videoId;

  try {
    const transcriptData = await services.summarize.generateTranscript(videoId);

    if (!transcriptData?.fullTranscript) {
      throw new Error("No transcript data found");
    }

    return new Response(JSON.stringify({ data: transcriptData, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
```

### Getting Transcript From YouTube

Next, let's create a service to call in our new route handler that will be responsible for generating our video.

![Screenshot 2025-08-27 at 12.24.43 PM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_12_24_43_PM_ee9906c861.png)

We will implement the following library [`youtubei.js`](https://www.npmjs.com/package/youtubei.js?activeTab=readme) in our Next.js application, directly.

Let's install it with the following:

```bash
yarn add youtubei.js
```

You can also move this functionality to Strapi via a plugin. You can learn how to do this in the [following tutorial](https://strapi.io/blog/how-to-build-your-first-strapi-5-plugin).

I like the plugin approach but to keep this tutorial in scope we will just implement it directly.

Navigate to `src/data/services` and create a new folder called `summary` and inside create a file called `generate-transcript.ts`.

And add the following code:

```ts
import {
  TranscriptData,
  TranscriptSegment,
  YouTubeTranscriptSegment,
  YouTubeAPIVideoInfo,
} from "./types";

const processTranscriptSegments = (
  segments: YouTubeTranscriptSegment[]
): TranscriptSegment[] => {
  return segments.map((segment) => ({
    text: segment.snippet.text,
    start: Number(segment.start_ms),
    end: Number(segment.end_ms),
    duration: Number(segment.end_ms) - Number(segment.start_ms),
  }));
};

const cleanImageUrl = (url: string): string => url.split("?")[0];

const validateIdentifier = (identifier: string): void => {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("Invalid YouTube video identifier");
  }
};

const extractBasicInfo = (info: YouTubeAPIVideoInfo) => {
  const { title, id: videoId, thumbnail } = info.basic_info;
  const thumbnailUrl = thumbnail?.[0]?.url;

  return {
    title: title || "Untitled Video",
    videoId,
    thumbnailUrl: thumbnailUrl ? cleanImageUrl(thumbnailUrl) : undefined,
  };
};

const getTranscriptSegments = async (
  info: YouTubeAPIVideoInfo
): Promise<YouTubeTranscriptSegment[]> => {
  const transcriptData = await info.getTranscript();

  if (!transcriptData?.transcript?.content?.body?.initial_segments) {
    throw new Error("No transcript available for this video");
  }

  return transcriptData.transcript.content.body.initial_segments;
};

export const generateTranscript = async (
  identifier: string
): Promise<TranscriptData> => {
  console.log(identifier);
  try {
    const { Innertube } = await import("youtubei.js");
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    console.log("IDENTIFIER", identifier, "VS", "LCYBVpSB0Wo");

    validateIdentifier(identifier);

    const info = await youtube.getInfo(identifier);

    console.log("INFO:", info);
    if (!info) {
      throw new Error("No video information found");
    }

    const { title, videoId, thumbnailUrl } = extractBasicInfo(
      info as YouTubeAPIVideoInfo
    );
    const segments = await getTranscriptSegments(info as YouTubeAPIVideoInfo);
    const transcriptWithTimeCodes = processTranscriptSegments(segments);
    const fullTranscript = segments
      .map((segment) => segment.snippet.text)
      .join(" ");

    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript,
      transcriptWithTimeCodes,
    };
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transcript"
    );
  }
};
```

Now let's create our `types` file and add the following types.

```ts
export interface StrapiConfig {
  baseUrl: string;
  apiToken: string;
  path: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  duration: number;
}

export interface TranscriptData {
  title: string | undefined;
  videoId: string | undefined;
  thumbnailUrl: string | undefined;
  fullTranscript: string | undefined;
  transcriptWithTimeCodes?: TranscriptSegment[];
}

// Add proper types
export interface SummaryData {
  fullTranscript: string;
  title: string;
  thumbnailUrl: string;
  transcriptWithTimeCodes: TranscriptSegment[];
}

export interface YouTubeTranscriptSegment {
  snippet: {
    text: string;
  };
  start_ms: string;
  end_ms: string;
}

export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeBasicInfo {
  title: string | undefined;
  id: string;
  thumbnail?: YouTubeThumbnail[];
}

export interface YouTubeTranscriptContent {
  transcript: {
    content: {
      body: {
        initial_segments: YouTubeTranscriptSegment[];
      };
    };
  };
}

// Minimal interface for the properties we actually use from the YouTube API
export interface YouTubeAPIVideoInfo {
  basic_info: {
    title?: string;
    id: string;
    thumbnail?: Array<{
      url: string;
      width?: number;
      height?: number;
    }>;
  };
  getTranscript(): Promise<YouTubeTranscriptContent>;
}
```

And finally let export our `summary` folder, let's create `index.ts` file and add the following code:

```ts
import { generateTranscript } from "./generate-transcript";

export { generateTranscript };
```

And finally let's add this to our root service `index.ts` file to export our summary service.

```ts
import { generateTranscript } from "./summary";

summarize: {
    generateTranscript,
},
```

The full file should look like the following:

```ts
import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";

import { updateProfileService, updateProfileImageService } from "./profile";
import { fileUploadService, fileDeleteService } from "./file";

import { generateTranscript } from "./summary";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
    updateProfileImageService,
  },
  file: {
    fileUploadService,
    fileDeleteService,
  },
  summarize: {
    generateTranscript,
  },
};
```

Now, let's update our form to incorperate our newly created route.

In the handle submit, lets add the following inside our try catch under **Step 1** comment:

```tsx
const transcriptResponse = await api.post<
  ITranscriptResponse,
  { videoId: string }
>("/api/transcript", { videoId: processedVideoId });

if (!transcriptResponse.success) {
  toast.dismiss(currentToastId);
  toast.error(transcriptResponse.error?.message);
  return;
}

const fullTranscript = !transcriptResponse.data?.fullTranscript;

if (!fullTranscript) {
  toast.dismiss(currentToastId);
  toast.error("No transcript data found");
  return;
}

console.log(fullTranscript);
```

Don't forget to import our `api` util at the top:

```tsx
import { api } from "@/data/data-api";
```

The complete `summary-form.tsx` file should look like the following.

```tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";
import { api } from "@/data/data-api";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

type ITranscriptResponse = {
  fullTranscript: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
};

interface IErrors {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;
    const processedVideoId = extractYouTubeID(videoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id",
      });
      return;
    }

    let currentToastId: string | number | undefined;

    try {
      // Step 1: Get transcript
      currentToastId = toast.loading("Getting transcript...");

      const transcriptResponse = await api.post<
        ITranscriptResponse,
        { videoId: string }
      >("/api/transcript", { videoId: processedVideoId });

      if (!transcriptResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(transcriptResponse.error?.message);
        return;
      }

      const fullTranscript = !transcriptResponse.data?.fullTranscript;

      if (!fullTranscript) {
        toast.dismiss(currentToastId);
        toast.error("No transcript data found");
        return;
      }

      console.log(fullTranscript);

      // Step 2: Generate summary
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Generating summary...");

      // Step 3: Save summary to database
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Saving summary...");

      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
    } catch (error) {
      if (currentToastId) toast.dismiss(currentToastId);
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create summary"
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full flex-1 mx-4">
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          className="bg-pink-500"
          loading={loading}
        />
      </form>
    </div>
  );
}
```

Now, let's test our front end to see if our transcript service is working as expected.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_testing_get_transript_fd4ab20542.mp4">
  Your browser does not support the video tag.
</video>

Once we submit our form, you should see the response in the console.

Excellent. Now that we have our transcript, we can use it to prepare our summary.

### Summarize Video with AI SDK with OPEN AI

We will leverage AI SDK to summarize our video.

It is an amazing library from Vercel, and makes it easy to interact with our OPEN AI LLM.

Let's first start by installing the package with the following.

And then we will go through the process of creating our summarize service.

We can install the AI SDK with the following:

```bash
yarn add ai
```

and

```bash
yarn add @ai-sdk/openai
```

Since we will be using the Open AI model.

**note:** You will need to add your Open AI API key in the .env file.

```tsx
OPENAI_API_KEY = your_api_key_here;
```

Now, let's create our service to generate our summary using AI SDK.

Navigate to our `summary` folder and create the following file `generate-summary.ts` and paste in the following code:

```ts
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function generateSummary(content: string, template?: string) {
  const systemPrompt =
    template ||
    `
    You are a helpful assistant that creates concise and informative summaries of YouTube video transcripts.
    Please summarize the following transcript, highlighting the key points and main ideas.
    Keep the summary clear, well-structured, and easy to understand.
  `;

  try {
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
      system: systemPrompt,
      prompt: `Please summarize this transcript:\n\n${content}`,
      temperature: process.env.OPENAI_TEMPERATURE
        ? parseFloat(process.env.OPENAI_TEMPERATURE)
        : 0.7,
      maxOutputTokens: process.env.OPENAI_MAX_TOKENS
        ? parseInt(process.env.OPENAI_MAX_TOKENS)
        : 4000,
    });

    return text;
  } catch (error) {
    console.error("Error generating summary:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }

    throw new Error("Failed to generate summary");
  }
}
```

Nice, now let's export our service from the `summary/index.ts` file:

```ts
import { generateTranscript } from "./generate-transcript";
import { generateSummary } from "./generate-summary";

export { generateTranscript, generateSummary };
```

And export it from the root `service/index.ts` file:

```ts
import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";

import { updateProfileService, updateProfileImageService } from "./profile";
import { fileUploadService, fileDeleteService } from "./file";

import { generateTranscript, generateSummary } from "./summary";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
    updateProfileImageService,
  },
  file: {
    fileUploadService,
    fileDeleteService,
  },
  summarize: {
    generateTranscript,
    generateSummary,
  },
};
```

Now let's go pack to our `summary-form.tsx` and add the following changes in the form submit handler bellow the **Step 2** comment:

```ts
const summaryResponse = await api.post<string, { fullTranscript: string }>(
  "/api/summarize",
  { fullTranscript: fullTranscript },
  { timeoutMs: 120000 }
);

if (!summaryResponse.success) {
  toast.dismiss(currentToastId);
  toast.error(summaryResponse.error?.message);
  return;
}

const summaryData = summaryResponse.data;

if (!summaryData) {
  toast.dismiss(currentToastId);
  toast.error("No summary generated");
  return;
}

console.log(summaryData);
```

Notice we are making a **POST** request to `/api/summarize` endpoint, we did not yet create one, but it will follow a simular pattern of creating next.js routes.

Inside of our `app/api` folder, create a new folder called `summarize` with a file called `route.ts` and add the following code:

```ts
import { NextRequest } from "next/server";
import { actions } from "@/data/actions";
import { services } from "@/data/services";

export const maxDuration = 150;
export const dynamic = "force-dynamic";

const TEMPLATE = `
You are an expert content analyst and copywriter. Create a comprehensive summary following this exact structure:

## Quick Overview
Start with a 2-3 sentence description of what this content covers.

## Key Topics Summary
Summarize the content using 5 main topics. Write in a conversational, first-person tone as if explaining to a friend.

## Key Points & Benefits
List the most important points and practical benefits viewers will gain.

## Detailed Summary
Write a complete Summary including:
- Engaging introduction paragraph
- Timestamped sections (if applicable)
- Key takeaways section
- Call-to-action

---
Format your response using clear markdown headers and bullet points. Keep language natural and accessible throughout.
`.trim();

export async function POST(req: NextRequest) {
  const user = await services.auth.getUserMeService();
  const token = await actions.auth.getAuthTokenAction();

  if (!user.success || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  console.log("USER CREDITS: ", user.data?.credits);

  if (!user.data || (user.data.credits || 0) < 1) {
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );
  }

  const body = await req.json();
  const { fullTranscript } = body;

  if (!fullTranscript) {
    return new Response(JSON.stringify({ error: "No transcript provided" }), {
      status: 400,
    });
  }

  try {
    const summary = await services.summarize.generateSummary(
      fullTranscript,
      TEMPLATE
    );

    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Error generating summary." }));
  }
}
```

This route is gong to use our `generateSummaryService` also you may notice this code snippet where we check if user has enough credits.

```ts
if (!user.data || (user.data.credits || 0) < 1) {
  return new Response(
    JSON.stringify({
      error: {
        status: 402,
        name: "InsufficientCredits",
        message: "Insufficient credits to generate summary",
      },
    }),
    { status: 402 }
  );
}
```

Now, let's check if we are getting the summary?

Great! The insufficient credits error message works correctly. When we update the credits, we can successfully generate our summary.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_generate_summary_d42f034a44.mp4">
  Your browser does not support the video tag.
</video>

Now that we know we are getting our summary, let's take a look how we can save our summaries to Strapi.

### Saving Our Summary To Strapi

First, create a new `collection-type` in Strapi admin to save our summary.

Navigate to the content builder page and create a new collection named `Summary` with the following fields.

![2025-08-27_15-21-47.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_27_15_21_47_56f9ae2296.png)

Let's add the following fields.

| Name    | Field     | Type       |
| ------- | --------- | ---------- |
| videoId | Text      | Short Text |
| title   | Text      | Short Text |
| content | Rich Text | Markdown   |
| userId  | Text      | Short Text |

You can make a relations between the **Summary** and **User** collection types. But in this case we will only use the `userId` field to store the `documentId` of the user who created the summary.

This way we don't need to expose the `user` api which is something we would have to do if we were to make a relations between the **Summary** and **User** collection types.

So whenever we want to find all summaries for a user, we can simply query the **Summary** collection type and filter by the `userId` field.

Here is what the final fields will look like.

![2025-08-27_15-27-38.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_27_15_27_38_0f95ef3797.png)

Now, navigate to `Setting` and add the following permissions.

![2025-08-27_15-29-23.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_27_15_29_23_b8099301b9.png)

Now that we have our **Summary** `collection-type`, let's create a service to handle saving our summary to Strapi.

Navigate to our `summary` folder in service and create the following file `save-summary.ts` and add the following code:

```ts
import qs from "qs";
import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TSummary } from "@/types";
import { api } from "@/data/data-api";

const baseUrl = getStrapiURL();

export async function saveSummaryService(
  summaryData: Partial<TSummary>
): Promise<TStrapiResponse<TSummary>> {
  const query = qs.stringify({
    populate: "*",
  });

  const url = new URL("/api/summaries", baseUrl);
  url.search = query;

  // Strapi expects data to be wrapped in a 'data' object
  const payload = { data: summaryData };
  const result = await api.post<TSummary, typeof payload>(url.href, payload);

  console.log("######### actual save summary response");
  console.dir(result, { depth: null });

  return result;
}
```

Make sure to export it from the `summary/index.ts` file:

```ts
import { generateTranscript } from "./generate-transcript";
import { generateSummary } from "./generate-summary";
import { saveSummaryService } from "./save-summary";

export { generateTranscript, generateSummary, saveSummaryService };
```

And export it from the root `index.ts` file found in the `services` folder:

```ts
import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";

import { updateProfileService, updateProfileImageService } from "./profile";
import { fileUploadService, fileDeleteService } from "./file";

import {
  generateTranscript,
  generateSummary,
  saveSummaryService,
} from "./summary";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
    updateProfileImageService,
  },
  file: {
    fileUploadService,
    fileDeleteService,
  },
  summarize: {
    generateTranscript,
    generateSummary,
    saveSummaryService,
  },
};
```

Now that we have our `saveSummaryService`, let's use it in our `handleFormSubmit,` found in our form named `summary-form.tsx`.

First, let's import our newly created service.

Update the `handleFormSubmit` with the following code after the **Step 3** comment:

```tsx
const saveResponse = await services.summarize.saveSummaryService({
  title: transcriptResponse.data?.title || `Summary for ${processedVideoId}`,
  content: summaryResponse.data,
  videoId: processedVideoId,
});

if (!saveResponse.success) {
  toast.dismiss(currentToastId);
  toast.error(saveResponse.error?.message);
  return;
}

console.log("SAVE RESPONSE:", saveResponse);
toast.dismiss(currentToastId);
currentToastId = undefined;
toast.success("Summary Created and Saved!");
setValue("");

// Redirect to the summary details page
router.push("/dashboard/summaries/" + saveResponse.data?.documentId);
```

Notice we are using `router.push()` make sure to import it from `useRouter` at the top.

```tsx
import { useRouter } from "next/navigation";
```

and define it in the component:

```tsx
const router = useRouter();
```

The final code should look like the following:

```tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";
import { api } from "@/data/data-api";
import { useRouter } from "next/navigation";
import { services } from "@/data/services";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

type ITranscriptResponse = {
  fullTranscript: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
};

interface IErrors {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: "",
};

export function SummaryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;
    const processedVideoId = extractYouTubeID(videoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id",
      });
      return;
    }

    let currentToastId: string | number | undefined;

    try {
      // Step 1: Get transcript
      currentToastId = toast.loading("Getting transcript...");

      const transcriptResponse = await api.post<
        ITranscriptResponse,
        { videoId: string }
      >("/api/transcript", { videoId: processedVideoId });

      if (!transcriptResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(transcriptResponse.error?.message);
        return;
      }

      const fullTranscript = transcriptResponse.data?.fullTranscript;

      if (!fullTranscript) {
        toast.dismiss(currentToastId);
        toast.error("No transcript data found");
        return;
      }

      // Step 2: Generate summary
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Generating summary...");

      const summaryResponse = await api.post<
        string,
        { fullTranscript: string }
      >(
        "/api/summarize",
        { fullTranscript: fullTranscript },
        { timeoutMs: 120000 }
      );

      if (!summaryResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(summaryResponse.error?.message);
        return;
      }

      const summaryData = summaryResponse.data;

      if (!summaryData) {
        toast.dismiss(currentToastId);
        toast.error("No summary generated");
        return;
      }

      console.log(summaryData);

      // Step 3: Save summary to database
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Saving summary...");

      const saveResponse = await services.summarize.saveSummaryService({
        title:
          transcriptResponse.data?.title || `Summary for ${processedVideoId}`,
        content: summaryResponse.data,
        videoId: processedVideoId,
      });

      if (!saveResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(saveResponse.error?.message);
        return;
      }

      console.log("SAVE RESPONSE:", saveResponse);
      toast.dismiss(currentToastId);
      currentToastId = undefined;
      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
      router.push("/dashboard/summaries/" + saveResponse.data?.documentId);

      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
    } catch (error) {
      if (currentToastId) toast.dismiss(currentToastId);
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create summary"
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full flex-1 mx-4">
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          className="bg-pink-500"
          loading={loading}
        />
      </form>
    </div>
  );
}
```

The above code will be responsible for saving our data into Strapi.

Let's do a quick test and see if it works. We should be redirected to our `summaries` route, which we have yet to create, so we will get our not found page. This is okay, and we will fix it soon.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_summary_create_and_redirect_88a36fe2aa.mp4">
[06-article-summary-create-and-redirect.mp4](https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_summary_create_and_redirect_88a36fe2aa.mp4)
  Your browser does not support the video tag.
</video>

Nice, we are able to save our summary to our Strapi database.

![2025-08-27_15-53-06.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_27_15_53_06_ae309e918b.png)

You will notice that we are not setting our user or deducting one credit on creation. We will do this in Strapi by creating custom middleware. But first, let's finish all of our Next.js UI.

## Create Summary Page Card View

Let's navigate to our `dashboard` folder. Inside, create another folder named `summaries` with a `page.tsx` file and paste it into the following code:

```tsx
import { loaders } from "@/data/loaders";
import { SummariesGrid } from "@/components/custom/summaries-grid";
import { validateApiResponse } from "@/lib/error-handler";

export default async function SummariesRoute() {
  const data = await loaders.getSummaries();
  const summaries = validateApiResponse(data, "summaries");

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 gap-6">
      <SummariesGrid summaries={summaries} className="flex-grow" />
    </div>
  );
}
```

Before this component works, we must create the `getSummaries` function to load our data.

Let's navigate to our `loaders.ts` file and make the following changes.

First, import the actions and our TSummary type:

```ts
import type {
  // rest of type
  TSummary,
} from "@/types";
import { actions } from "@/data/actions";
```

Next, lets create the `getSummaries` loader function with the following code.

```ts
async function getSummaries(): Promise<TStrapiResponse<TSummary[]>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const query = qs.stringify({
    sort: ["createdAt:desc"],
  });

  const url = new URL("/api/summaries", baseUrl);
  url.search = query;
  return api.get<TSummary[]>(url.href, { authToken });
}
```

Don't forget to export it from the bottom of the file:

```ts
export const loaders = {
  getHomePageData,
  getGlobalData,
  getMetaData,
  getSummaries,
};
```

Now that we have our loader, back in out `summary-form.tsx` we are using our SummaryGrid component. Let's create it now.

In the `components/custom` folder create a new file called `summaries-grid` and add the following code:

```tsx
import Link from "next/link";
import { TSummary } from "@/types";
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ILinkCardProps {
  summary: TSummary;
}

const styles = {
  card: "relative hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200",
  cardHeader: "pb-3",
  cardTitle: "text-lg font-semibold text-pink-600 leading-tight line-clamp-2",
  cardContent: "pt-0",
  markdown: `prose prose-sm max-w-none overflow-hidden
    prose-headings:text-gray-900 prose-headings:font-medium prose-headings:text-base prose-headings:mb-1 prose-headings:mt-0 prose-headings:leading-tight
    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm prose-p:mb-1 prose-p:mt-0
    prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
    prose-strong:text-gray-900 prose-strong:font-medium
    prose-ul:list-disc prose-ul:pl-4 prose-ul:text-sm prose-ul:mb-1 prose-ul:mt-0
    prose-ol:list-decimal prose-ol:pl-4 prose-ol:text-sm prose-ol:mb-1 prose-ol:mt-0
    prose-li:text-gray-600 prose-li:text-sm prose-li:mb-0
    [&>*:nth-child(n+4)]:hidden`,
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
};

function LinkCard({ summary }: Readonly<ILinkCardProps>) {
  const { documentId, title, content } = summary;
  return (
    <Link href={`/dashboard/summaries/${documentId}`}>
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>
            {title || "Video Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={styles.markdown}>
            <Markdown>{content.slice(0, 150)}</Markdown>
          </div>
          <p className="text-pink-500 font-medium text-xs mt-3">Read more →</p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ISummariesGridProps {
  summaries: TSummary[];
  className?: string;
}

export function SummariesGrid({ summaries, className }: ISummariesGridProps) {
  return (
    <div className={cn(styles.grid, className)}>
      {summaries.map((item: TSummary) => (
        <LinkCard key={item.documentId} summary={item} />
      ))}
    </div>
  );
}
```

Notice it is using `react-markdown` package, let's install it:

```bash
yarn add react-markdown
```

Perfect! Now that everything is connected, when you navigate to the summaries page, you'll see your first summary.

![Screenshot 2025-08-27 at 4.14.40 PM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_4_14_40_PM_bb5b5ced4f.png)

Now that we have our **Summaries** view working, let's create a detail view that displays both the summary and video.


## Creating Dynamic Routes In Next.js

Let's create a dynamic route. Dynamic routes allow you to add custom parameters to your URLs - perfect for individual summary pages.

Learn more about [dynamic routes in the Next.js docs](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes).

Create a new folder called `[documentId]` inside the `summaries` folder with a `page.tsx` file:

```tsx
import { Params } from "@/types";
// import { loaders } from "@/data/loaders";
// import { extractYouTubeID } from "@/lib/utils";
// import { validateApiResponse } from "@/lib/error-handler";
import { notFound } from "next/navigation";
// import { YouTubePlayer } from "@/components/custom/youtube-player";
// import { SummaryUpdateForm } from "@/components/forms/summary-update-form"

interface IPageProps {
  params: Params;
}

export default async function SummarySingleRoute({ params }: IPageProps) {
  const resolvedParams = await params;
  const documentId = resolvedParams?.documentId;

  if (!documentId) notFound();

  // const data = await loaders.getSummaryByDocumentId(documentId);
  // const summary = validateApiResponse(data, "summary");
  // const videoId = extractYouTubeID(summary.videoId);

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3 h-full">
          <pre>Document Id: {documentId}</pre>
          {/* <SummaryUpdateForm summary={summary}/> */}
        </div>
        <div className="col-span-2">
          <div>
            {/* {videoId ? (
              <YouTubePlayer videoId={videoId} />
            ) : (
              <p>Invalid video URL</p>
            )}
            <h1 className="text-2xl font-bold mt-4">{summary.title}</h1> */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

Before implementing our loader and other components, let's test the dynamic page.

When you click on a summary card, you'll be redirected to the single summary view showing the documentId.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_testing_redirect_dynami_route_3c664d437d.mp4">
  Your browser does not support the video tag.
</video>

Now that we know our pages work, let's create the loaders to get the appropriate data.

### Fetching And Displaying Our Single Video and Summary

Let's start by navigating our `loaders.ts` file and adding the following functions.

```tsx
async function getSummaryByDocumentId(
  documentId: string
): Promise<TStrapiResponse<TSummary>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const path = `/api/summaries/${documentId}`;
  const url = new URL(path, baseUrl);

  return api.get<TSummary>(url.href, { authToken });
}
```

Don't forget to export it:

```ts
export const loaders = {
  getHomePageData,
  getGlobalData,
  getMetaData,
  getSummaries,
  getSummaryByDocumentId,
};
```

To make sure that we are loading our data, let's go back to our `summaries/[documentId]/page.tsx` and uncomment the loader and the validation and add a console for our content:

```tsx
import { Params } from "@/types";
import { loaders } from "@/data/loaders";
import { extractYouTubeID } from "@/lib/utils";
import { validateApiResponse } from "@/lib/error-handler";
import { notFound } from "next/navigation";
// import { YouTubePlayer } from "@/components/custom/youtube-player";
// import { SummaryUpdateForm } from "@/components/forms/summary-update-form"

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
          <pre>Document Id: {documentId}</pre>
          <pre>{JSON.stringify(summary)}</pre>
          {/* <SummaryUpdateForm summary={summary}/> */}
        </div>
        <div className="col-span-2">
          <div>
            {/* {videoId ? (
              <YouTubePlayer videoId={videoId} />
            ) : (
              <p>Invalid video URL</p>
            )}
            <h1 className="text-2xl font-bold mt-4">{summary.title}</h1> */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

If you navigate to your summary, you should see the following.

![Screenshot 2025-08-27 at 4.52.53 PM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_4_52_53_PM_0b5bb8e7df.png)

Now that we know we are getting our data, let's create the last two components, one for our video player, and the other to display our content.

## Create a Simple YouTube Player

There are many packages online that we can use, but in this tutorial we will take the simplest approach and use an `iframe`.

Inside of our `components` folder under `custom` let's create the the following file `youtube-player.tsx` with this code:

```tsx
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
```

Now let's navigate back to our single summary page and uncomment th youtube player import and code snippet.

The code should look like the following:

```tsx
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
```

Now when we navigate to our single summary view we should see the following.

![Screenshot 2025-08-27 at 5.00.08 PM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_5_00_08_PM_398c362b5f.png)

Now, let's display our summary.

## How To Create Markdown Editor

We are going to create a nice Markdown editor to display our content. We will use a popular open source editor called MDX Editor you can learn more about it here.

Let's start by creating a new folder in our `components/custom` called `editor` with a file called `mdx-editor-client.tsx` witht the following code.

```tsx
"use client";
// Note: this is build based on this library: https://mdxeditor.dev/editor/demo
import "@mdxeditor/editor/style.css";
import "./editor.css";
import { cn } from "@/lib/utils";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  ConditionalContents,
  Separator,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  markdownShortcutPlugin,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  imagePlugin,
  codeBlockPlugin,
  tablePlugin,
  linkDialogPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  CodeToggle,
  BlockTypeSelect,
} from "@mdxeditor/editor";
import { basicLight } from "cm6-theme-basic-light";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";
export default function MDXEditorClient({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { resolvedTheme } = useTheme();
  const theme = [basicLight];
  return (
    <div
      className={cn(
        "min-h-[350px] rounded-md border background-light500_dark200 text-light-700_dark300 light-border-2 w-full dark-editor markdown-editor",
        props.className
      )}
    >
      <MDXEditor
        key={resolvedTheme}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "css",
              txt: "txt",
              sql: "sql",
              html: "html",
              saas: "saas",
              scss: "scss",
              bash: "bash",
              json: "json",
              js: "javascript",
              ts: "typescript",
              "": "unspecified",
              tsx: "TypeScript (React)",
              jsx: "JavaScript (React)",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        <UndoRedo />

                        <Separator />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />

                        <Separator />
                        <BlockTypeSelect />

                        <Separator />
                        <CreateLink />

                        <Separator />
                        <ListsToggle />

                        <Separator />
                        <InsertTable />
                        <InsertThematicBreak />

                        <Separator />
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
}
```

Now let's install the following packages:

```bash
yarn add @mdxeditor/editor
# and
yarn add cm6-theme-basic-light
```

Notice this require custom CSS, let's go ahead and add this now. Create a new file called `editor.css` and add the following:

```css
/* @import "@mdxeditor/editor/style.css"; */
@import url("@radix-ui/colors/tomato-dark.css");
@import url("@radix-ui/colors/mauve-dark.css");

.markdown-editor {
}

/* Force MDX editor to respect container height and enable internal scrolling */
.mdxeditor-popup-container._editorRoot_1e2ox_53 {
  height: 100% !important;
  max-height: 100% !important;
  overflow-y: auto !important;
}

/* Ensure the editor content area scrolls properly */
.mdxeditor-popup-container._editorRoot_1e2ox_53 .w-full {
  height: 100% !important;
  overflow-y: auto !important;
}

.dark .dark-editor {
  --accentBase: var(--tomato-1);
  --accentBgSubtle: var(--tomato-2);
  --accentBg: var(--tomato-3);
  --accentBgHover: var(--tomato-4);
  --accentBgActive: var(--tomato-5);
  --accentLine: var(--tomato-6);
  --accentBorder: var(--tomato-7);
  --accentBorderHover: var(--tomato-8);
  --accentSolid: var(--tomato-9);
  --accentSolidHover: var(--tomato-10);
  --accentText: var(--tomato-11);
  --accentTextContrast: var(--tomato-12);

  --baseBase: var(--mauve-1);
  --baseBgSubtle: var(--mauve-2);
  --baseBg: var(--mauve-3);
  --baseBgHover: var(--mauve-4);
  --baseBgActive: var(--mauve-5);
  --baseLine: var(--mauve-6);
  --baseBorder: var(--mauve-7);
  --baseBorderHover: var(--mauve-8);
  --baseSolid: var(--mauve-9);
  --baseSolidHover: var(--mauve-10);
  --baseText: var(--mauve-11);
  --baseTextContrast: var(--mauve-12);

  --admonitionTipBg: var(--cyan4);
  --admonitionTipBorder: var(--cyan8);

  --admonitionInfoBg: var(--grass4);
  --admonitionInfoBorder: var(--grass8);

  --admonitionCautionBg: var(--amber4);
  --admonitionCautionBorder: var(--amber8);

  --admonitionDangerBg: var(--red4);
  --admonitionDangerBorder: var(--red8);

  --admonitionNoteBg: var(--mauve-4);
  --admonitionNoteBorder: var(--mauve-8);

  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;

  color: var(--baseText);
  --basePageBg: black;
  background: var(--basePageBg);
}
```

Next inside the `editor` folder create another file called `editor-wrapper.tsx` with the following code:

```tsx
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
```

claude explain the aboce snippet and why we need to do this in next js

We are using alert component from shadcn ui, so let's add it with the following:

```bash
npx shadcn@latest add alert
```

Finally let's create an `index.ts` inside our `editor` folder and add the following export:

```tsx
"use client";
import { useState } from "react";
import { EditorWrapper } from "@/components/custom/editor/editor-wrapper";
import type { TSummary } from "@/types";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/delete-button";

interface ISummaryUpdateFormProps {
  summary: TSummary;
}

const styles = {
  container: "flex flex-col px-2 py-0.5 relative",
  titleInput: "mb-3",
  editor: "h-[calc(100vh-215px)] overflow-y-auto",
  buttonContainer: "mt-3",
  updateButton: "inline-block",
  deleteFormContainer: "absolute bottom-0 right-2",
  deleteButton: "bg-pink-500 hover:bg-pink-600",
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [content, setContent] = useState(summary.content);

  return (
    <div className={styles.container}>
      <form>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder={"Title"}
          defaultValue={summary.title || ""}
          className={styles.titleInput}
        />

        <input type="hidden" name="content" value={content} />

        <div>
          <EditorWrapper
            markdown={summary.content}
            onChange={setContent}
            className={styles.editor}
          />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
      </form>

      <div className={styles.deleteFormContainer}>
        <form onSubmit={() => console.log("DELETE FORM SUBMITTED")}>
          <DeleteButton className={styles.deleteButton} />
        </form>
      </div>
    </div>
  );
}
```

Nice. 
 
Also, notice that we are using a new component, **DeleteButton**. Let's create it inside our `components/custom` folder. Create a `delete-button.tsx` file and add the following code.

```tsx
"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="flex items-center">
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}

interface DeleteButtonProps {
  className?: string;
}

export function DeleteButton({ className }: Readonly<DeleteButtonProps>) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={status.pending}
      disabled={status.pending}
      className={cn(className)}
    >
      {status.pending ? <Loader /> : <TrashIcon className="w-4 h-4" />}
    </Button>
  );
}
```

Now let's uncomment our **SummaryUpdateForm** component and see if our content shows up.

The completed code should look like the following:

``` tsx
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
          <pre>Document Id: {documentId}</pre>
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

```

Now, navigate to our single summary page and you should see the following.

![Screenshot 2025-08-27 at 5.35.54 PM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_27_at_5_35_54_PM_9a2d2c4e88.png)

Great! Now that we've created all our basic components to display summaries, let's test the complete flow.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_redirect_to_single_view_form_3a75de7434.mp4">
  Your browser does not support the video tag.
</video>

Before working on form submission for updates and deletes, let's fix an important issue: summaries aren't currently associated with the users who created them.

## Using Strapi Route Middleware To Set User/Summary Relation

We'll set the summary/user relationship on the backend, where we can securely verify the logged-in user.

This prevents malicious users from spoofing user IDs from the frontend.

We'll also handle credit deduction in the middleware.

### What is Route Middleware?

Route middleware in Strapi has a more limited scope than global middleware. It controls request flow and can modify requests before they proceed.

![018-middleware.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/018_middleware_85c6da3764.png)

Route middleware can control access and perform additional logic. For example, it can modify the request context before passing it to Strapi's core elements.

You can learn more about route middlewares [here](https://docs.strapi.io/dev-docs/backend-customization/middlewares).

Let's create our route middleware using the Strapi CLI. In your `backend` folder, run:

```bash
yarn strapi generate
```

Choose to generate a middleware option.

```bash
➜  backend git:(main) ✗ yarn strapi generate
yarn run v1.22.22
$ strapi generate
? Strapi Generators
  api - Generate a basic API
  controller - Generate a controller for an API
  content-type - Generate a content type for an API
  policy - Generate a policy for an API
❯ middleware - Generate a middleware for an API
  migration - Generate a migration
  service - Generate a service for an API
```

We'll call it `on-summary-create` and add it to the existing `summary` API.

```bash
? Strapi Generators middleware - Generate a middleware for an API
? Middleware name on-summary-create
? Where do you want to add this middleware?
  Add middleware to root of project
❯ Add middleware to an existing API
  Add middleware to an existing plugin
```

```bash
$ strapi generate
? Strapi Generators middleware - Generate a middleware for an API
? Middleware name on-summary-create
? Where do you want to add this middleware? Add middleware to an existing API
? Which API is this for?
  global
  home-page
❯ summary
```

Now, let's take a look in the following folder: `backend/src/api/summary/middlewares.` You should see the following file: `on-summary-create` with the following boilerplate.

```js
/**
 * `on-summary-create` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In on-summary-create middleware.");

    await next();
  };
};
```

Let's update it with the following code.

```ts
/**
 * `on-summary-create` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You are not authenticated");

    const availableCredits = user.credits;
    if (availableCredits === 0)
      return ctx.unauthorized("You do not have enough credits.");

    console.log("############ Inside middleware end #############");

    // ADD THE AUTHOR ID TO THE BODY
    const modifiedBody = {
      ...ctx.request.body,
      data: {
        ...ctx.request.body.data,
        userId: ctx.state.user.documentId,
      },
    };

    ctx.request.body = modifiedBody;

    await next();

    // UPDATE THE USER'S CREDITS
    try {
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: user.documentId,
        data: {
          credits: availableCredits - 1,
        },
      });
    } catch (error) {
      ctx.badRequest("Error Updating User Credits");
    }

    console.log("############ Inside middleware end #############");
  };
};
```

In the code above, we add the userId to the body and deduct one credit from the user.

Before testing it out, we have to enable it inside our route.

You can learn more about Strapi's routes [here](https://docs.strapi.io/dev-docs/backend-customization/routes).

Navigate to the `backend/src/api/summary/routes/summary.js` file and update with the following.

```ts
/**
 * summary router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::summary.summary", {
  config: {
    create: {
      middlewares: ["api::summary.on-summary-create"],
    },
  },
});
```

Now, our middleware will fire when we create a new summary.

Now, restart your Strapi backend and Next.js frontend and create a new summary.

You will see that we are now setting our user data.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/06_article_add_user_in_backend_de52b1516a.mp4">
  Your browser does not support the video tag.
</video>

## Conclusion

In this tutorial, we built a complete video summary feature using OpenAI and the Vercel AI SDK. Here's what we accomplished:

- Created a `SummaryForm` component with YouTube URL validation
- Built Next.js API routes for transcript fetching and AI summarization  
- Implemented credit-based access control
- Created a summary listing page with card-based layout
- Built dynamic routes for individual summary pages
- Added Strapi middleware for user association and credit deduction

In the next post, we'll add update/delete functionality and implement policies to ensure users can only modify their own content.

This series demonstrates how modern web development combines multiple technologies to create powerful, AI-enhanced applications.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.


Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

Paul
