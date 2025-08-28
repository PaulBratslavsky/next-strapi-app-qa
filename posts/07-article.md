Welcome back to our Epic Next.js tutorial series!

In our previous tutorial, we learned how to generate video summaries using OpenAI and save them to our database. Now we're ready to take the next step.

- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-15-tutorial-part-1-learn-next-js-by-building-a-real-life-project)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-15-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishup up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-15-tutorial-part-3-finishup-up-the-homepage-features-section-top-navigation-and-footer)
- [Part 4: How to handle login and Authentification in Next.js](https://strapi.io/blog/epic-next-js-15-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: Building out the Dashboard page and upload file using NextJS server actions](https://strapi.io/blog/epic-next-js-15-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with AI SDK](https://strapi.io/blog/epic-next-js-15-tutorial-part-6-create-video-summary-with-next-js-and-ai-sdk)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-15-tutorial-part-7-next-js-and-strapi-crud-permissions)
- **Part 8: Search & pagination in Nextjs**
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-14-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-14-tutorial-part-10-frontend-deployment-to-vercel)

![2025-08-28_13-06-35.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_28_13_06_35_326636af85.png)

## What We'll Build Today

In this tutorial, we'll implement secure update and delete functionality for our video summaries. Users will be able to edit their summaries and remove ones they no longer need - but only their own content.

**Key Security Challenge:** We need to ensure that users can only modify or delete summaries they own. A user should never be able to access or change another user's content.

We'll solve this using a combination of modern Next.js server actions and custom Strapi middleware for bulletproof security.

## Understanding CRUD Operations

Before diving into implementation, let's review the four essential database operations that power our application:

**The Four CRUD Operations:**

- **Create (POST)**: Adds new content to our database - like saving a new video summary
- **Read (GET)**: Retrieves existing data - like loading a summary or listing all summaries
- **Update (PUT)**: Modifies existing content - like editing a summary's title or content
- **Delete (DELETE)**: Permanently removes content - like deleting an unwanted summary

### How Strapi Handles CRUD

Strapi automatically creates RESTful API endpoints for our summary content type:

- Create Summary: `POST /api/summaries`
- Find All Summaries: `GET /api/summaries`
- Find One Summary: `GET /api/summaries/:id`
- Update Summary: `PUT /api/summaries/:id`
- Delete Summary: `DELETE /api/summaries/:id`

These endpoints form the backbone of our application's data operations.

### The Security Challenge

While Strapi provides basic authentication through JWT tokens, there's an important distinction we need to understand:

**Authentication vs Authorization:**

- **Authentication**: "Who are you?" - Handled by JWT tokens when users log in
- **Authorization**: "What are you allowed to do?" - This is where we need custom logic

Here's the problem: By default, an authenticated user can access **any** summary in the system, not just their own. If User A creates a summary, User B (who is also logged in) could potentially view, edit, or delete it.

**The Current Flow:**
1. User logs in and receives a JWT token
2. User makes a request with their token
3. Strapi validates the token (authentication ✅)
4. Strapi allows access to **all** summaries (authorization ❌)

**What We Need:**
Custom middleware that checks ownership before allowing operations on summaries.

## Understanding Route Middleware

Think of route middleware as a security guard at a building entrance. Every request must pass through this checkpoint before accessing your data.

### How Middleware Works

![002-diagram-global-middlewares.png](https://api-prod.strapi.io/uploads/002_diagram_global_middlewares_fdf47427fb.png)

**The Middleware Process:**

1. **Intercept**: Every incoming request is captured before it reaches the database
2. **Authenticate**: Verify the user has a valid login token
3. **Authorize**: Check if the user owns the content they're trying to access
4. **Allow or Deny**: Either let the request proceed or block it with an error

**Why This Matters:**
Without proper middleware, any logged-in user could modify any summary in your system. Middleware ensures users can only access their own content.

> **Learn More**: Check out the [official Strapi middleware documentation](https://docs.strapi.io/dev-docs/backend-customization/middlewares) for additional details.

## Implementation Strategy

We'll tackle this in two phases:
1. **Frontend**: Build the update/delete forms using Next.js server actions
2. **Backend**: Create Strapi middleware to enforce ownership rules

Let's start with the frontend implementation.

## Building the Frontend: Summary Update Form

Let's start by implementing the user interface for updating and deleting summaries. Our form will handle both operations securely using Next.js server actions.

In your project's frontend, locate the file `summary-update-form.tsx`. Currently, it contains a basic form structure from our previous tutorial:

```tsx
"use client";
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

        <input type="hidden" name="content" defaultValue={summary.content} />

        <div>
          <EditorWrapper
            markdown={summary.content}
            onChange={(value) => {
              const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = value;
            }}
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

As you can see, the form structure is there, but it's missing the actual functionality. The forms don't do anything yet because we haven't implemented the server actions.

Let's build this functionality step by step, following the same architectural patterns we used for profile management in earlier tutorials.

### Step 1: Create Validation Schemas

First, we need to define what valid input looks like for our update and delete operations. This prevents invalid data from reaching our server and provides clear error messages to users.

Create a new file at `src/data/validation/summary.ts`:

```tsx
import { z } from "zod";

export const SummaryUpdateFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  documentId: z.string().min(1, "Document ID is required"),
});

export type SummaryUpdateFormValues = z.infer<typeof SummaryUpdateFormSchema>;

export type SummaryUpdateFormState = {
  success?: boolean;
  message?: string;
  data?: {
    title?: string;
    content?: string;
    documentId?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    title?: string[];
    content?: string[];
    documentId?: string[];
  } | null;
};

export const SummaryDeleteFormSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
});

export type SummaryDeleteFormValues = z.infer<typeof SummaryDeleteFormSchema>;

export type SummaryDeleteFormState = {
  success?: boolean;
  message?: string;
  data?: {
    documentId?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    documentId?: string[];
  } | null;
};
```

### Step 2: Create Update and Delete Services

Now we need to create the service functions that will communicate with our Strapi API. These services handle the actual HTTP requests to update and delete summaries.

In the `src/data/services/summary/` directory, create two new files:

**update-summary.ts:**
```tsx
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
  
  return result;
}
```

**delete-summary.ts:**
```tsx
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
  
  return result;
}
```

### Step 3: Update Services Index Files

Now we need to make our new services available throughout the application by updating the index files.

Update `src/data/services/summary/index.ts` to export the new services:

```tsx
import { generateTranscript } from "./generate-transcript";
import { generateSummary } from "./generate-summary";
import { saveSummaryService } from "./save-summary";
import { updateSummaryService } from "./update-summary";
import { deleteSummaryService } from "./delete-summary";

export { 
  generateTranscript, 
  generateSummary, 
  saveSummaryService, 
  updateSummaryService, 
  deleteSummaryService 
};
```

And update `src/data/services/index.ts`:

```tsx
// Add the new services to the summarize object
summarize: {
  generateTranscript,
  generateSummary,
  saveSummaryService,
  updateSummaryService,
  deleteSummaryService,
},
```

### Step 4: Create Server Actions

Server actions are the bridge between our forms and our services. They handle form data, validate it, and coordinate with our backend services.

Create a new file at `src/data/actions/summary.ts`:

```tsx
"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { services } from "@/data/services";

import {
  SummaryUpdateFormSchema,
  SummaryDeleteFormSchema,
  type SummaryUpdateFormState,
  type SummaryDeleteFormState,
} from "@/data/validation/summary";

export async function updateSummaryAction(
  prevState: SummaryUpdateFormState,
  formData: FormData
): Promise<SummaryUpdateFormState> {
  const fields = Object.fromEntries(formData);

  const validatedFields = SummaryUpdateFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const { documentId, ...updateData } = validatedFields.data;

  try {
    const responseData = await services.summarize.updateSummaryService(
      documentId,
      updateData
    );

    if (responseData.error) {
      return {
        success: false,
        message: "Failed to update summary.",
        strapiErrors: responseData.error,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields,
        },
      };
    }

    // Revalidate the current page and summaries list to show updated data
    revalidatePath(`/dashboard/summaries/${documentId}`);
    revalidatePath("/dashboard/summaries");

    return {
      success: true,
      message: "Summary updated successfully!",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update summary. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }
}

export async function deleteSummaryAction(
  prevState: SummaryDeleteFormState,
  formData: FormData
): Promise<SummaryDeleteFormState> {
  const fields = Object.fromEntries(formData);

  const validatedFields = SummaryDeleteFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  try {
    const responseData = await services.summarize.deleteSummaryService(
      validatedFields.data.documentId
    );

    if (responseData.error) {
      return {
        success: false,
        message: "Failed to delete summary.",
        strapiErrors: responseData.error,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields,
        },
      };
    }

    // If we get here, deletion was successful
    revalidatePath("/dashboard/summaries");
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete summary. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Redirect after successful deletion (outside try/catch)
  redirect("/dashboard/summaries");
}
```

### Step 5: Export Actions

Make the new actions available by updating the actions index file.

Update `src/data/actions/index.ts` to include the new summary actions:

```tsx
import { updateSummaryAction, deleteSummaryAction } from "./summary";

export const actions = {
  // ... existing actions
  summary: {
    updateSummaryAction,
    deleteSummaryAction,
  },
};
```

### Step 6: Update the Summary Update Form

Now comes the exciting part - connecting our form to the server actions we just created! We'll update the `summary-update-form.tsx` file to handle both update and delete operations with proper error handling and user feedback.

First, let's update the imports at the top of the file:

```tsx
"use client";
import React from "react";
import { useActionState } from "react";

import { EditorWrapper } from "@/components/custom/editor/editor-wrapper";
import type { TSummary } from "@/types";
import { actions } from "@/data/actions";
import type { SummaryUpdateFormState, SummaryDeleteFormState } from "@/data/validation/summary";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/delete-button";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
```

Next, let's set up the initial states for our forms:

```tsx
const INITIAL_UPDATE_STATE: SummaryUpdateFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

const INITIAL_DELETE_STATE: SummaryDeleteFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};
```

Now let's update the component implementation:

```tsx
export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [updateFormState, updateFormAction] = useActionState(
    actions.summary.updateSummaryAction,
    INITIAL_UPDATE_STATE
  );

  const [deleteFormState, deleteFormAction] = useActionState(
    actions.summary.deleteSummaryAction,
    INITIAL_DELETE_STATE
  );

  return (
    <div className={styles.container}>
      <form action={updateFormAction}>
        <input type="hidden" name="documentId" value={summary.documentId} />
        
        <div className={styles.fieldGroup}>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder={"Title"}
            defaultValue={updateFormState?.data?.title || summary.title || ""}
            className={styles.titleInput}
          />
          <ZodErrors error={updateFormState?.zodErrors?.title} />
        </div>

        <input 
          type="hidden" 
          name="content" 
          defaultValue={updateFormState?.data?.content || summary.content} 
        />

        <div className={styles.fieldGroup}>
          <EditorWrapper
            markdown={updateFormState?.data?.content || summary.content}
            onChange={(value) => {
              const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = value;
            }}
            className={styles.editor}
          />
          <ZodErrors error={updateFormState?.zodErrors?.content} />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
        
        <StrapiErrors error={updateFormState?.strapiErrors} />
        {updateFormState?.success && (
          <div className="text-green-600 mt-2">{updateFormState.message}</div>
        )}
        {updateFormState?.message && !updateFormState?.success && (
          <div className="text-red-600 mt-2">{updateFormState.message}</div>
        )}
      </form>

      <div className={styles.deleteFormContainer}>
        <form action={deleteFormAction}>
          <input type="hidden" name="documentId" value={summary.documentId} />
          <DeleteButton className={styles.deleteButton} />
        </form>
        
        <StrapiErrors error={deleteFormState?.strapiErrors} />
        {deleteFormState?.message && !deleteFormState?.success && (
          <div className="text-red-600 mt-1 text-sm">{deleteFormState.message}</div>
        )}
      </div>
    </div>
  );
}
```

The key changes we made:

1. **Added proper form state management** using `useActionState` for both update and delete operations
2. **Implemented validation error display** using `ZodErrors` component for field-specific errors
3. **Added success and error messaging** with proper styling
4. **Used hidden inputs** to pass the `documentId` to both forms
5. **Preserved form data** on validation errors by using form state data as fallback values
6. **Separated concerns** between the update and delete forms with their own error handling

### Important Note About Redirects

**Don't Panic About "NEXT_REDIRECT" Errors!**

When testing the delete functionality, you might see a scary-looking "NEXT_REDIRECT" error in your browser console. This is completely normal and expected - it's just how Next.js handles redirects internally.

**What's Happening:**
- User clicks delete button
- Summary gets deleted successfully  
- Next.js throws a special "NEXT_REDIRECT" error to trigger the redirect
- User gets redirected to the summaries list
- Everything works perfectly!

The error message looks alarming but it's actually a sign that everything is working correctly.

Here's what the complete `summary-update-form.tsx` file should look like after all the changes:

```tsx
"use client";
import React from "react";
import { useActionState } from "react";

import { EditorWrapper } from "@/components/custom/editor/editor-wrapper";
import type { TSummary } from "@/types";
import { actions } from "@/data/actions";
import type { SummaryUpdateFormState, SummaryDeleteFormState } from "@/data/validation/summary";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "@/components/custom/delete-button";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

interface ISummaryUpdateFormProps {
  summary: TSummary;
}

const INITIAL_UPDATE_STATE: SummaryUpdateFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

const INITIAL_DELETE_STATE: SummaryDeleteFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

const styles = {
  container: "flex flex-col px-2 py-0.5 relative",
  titleInput: "mb-3",
  editor: "h-[calc(100vh-215px)] overflow-y-auto",
  buttonContainer: "mt-3",
  updateButton: "inline-block",
  deleteFormContainer: "absolute bottom-0 right-2",
  deleteButton: "bg-pink-500 hover:bg-pink-600",
  fieldGroup: "space-y-1",
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [updateFormState, updateFormAction] = useActionState(
    actions.summary.updateSummaryAction,
    INITIAL_UPDATE_STATE
  );

  const [deleteFormState, deleteFormAction] = useActionState(
    actions.summary.deleteSummaryAction,
    INITIAL_DELETE_STATE
  );

  return (
    <div className={styles.container}>
      <form action={updateFormAction}>
        <input type="hidden" name="documentId" value={summary.documentId} />
        
        <div className={styles.fieldGroup}>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder={"Title"}
            defaultValue={updateFormState?.data?.title || summary.title || ""}
            className={styles.titleInput}
          />
          <ZodErrors error={updateFormState?.zodErrors?.title} />
        </div>

        <input 
          type="hidden" 
          name="content" 
          defaultValue={updateFormState?.data?.content || summary.content} 
        />

        <div className={styles.fieldGroup}>
          <EditorWrapper
            markdown={updateFormState?.data?.content || summary.content}
            onChange={(value) => {
              const hiddenInput = document.querySelector('input[name="content"]') as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = value;
            }}
            className={styles.editor}
          />
          <ZodErrors error={updateFormState?.zodErrors?.content} />
        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
        
        <StrapiErrors error={updateFormState?.strapiErrors} />
        {updateFormState?.success && (
          <div className="text-green-600 mt-2">{updateFormState.message}</div>
        )}
        {updateFormState?.message && !updateFormState?.success && (
          <div className="text-red-600 mt-2">{updateFormState.message}</div>
        )}
      </form>

      <div className={styles.deleteFormContainer}>
        <form action={deleteFormAction}>
          <input type="hidden" name="documentId" value={summary.documentId} />
          <DeleteButton className={styles.deleteButton} />
        </form>
        
        <StrapiErrors error={deleteFormState?.strapiErrors} />
        {deleteFormState?.message && !deleteFormState?.success && (
          <div className="text-red-600 mt-1 text-sm">{deleteFormState.message}</div>
        )}
      </div>
    </div>
  );
}
```

## Testing Our Update and Delete Features

Before we can test our new functionality, we need to ensure the proper permissions are set in Strapi. Let's make sure users can actually update and delete their summaries.

In your Strapi admin panel, navigate to Settings → Roles → Authenticated and ensure these permissions are enabled for the Summary content type:

![2025-08-27_15-29-23.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_27_15_29_23_efa0409a5a.png)

Great! Now let's test our update and delete functionality:

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/07_article_testing_update_and_delete_fea3a8cbe9.mp4">
  Your browser does not support the video tag.
</video>

## The Security Problem We Need to Fix

Our update and delete features work, but we have a major security issue! Currently, when we make a GET request to `/api/summaries`, we get **all** summaries from **all** users, not just the ones belonging to the logged-in user.

**Here's the Problem in Action:**

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/07_articles_users_access_all_622b66d249.mp4">
  Your browser does not support the video tag.
</video>

As you can see in the video:
- When I log in as one user, I can see summaries created by other users
- I can potentially edit or delete summaries that don't belong to me
- This is a serious privacy and security concern

**What Should Happen:**
- Users should only see their own summaries
- Users should only be able to edit/delete their own content
- Attempting to access another user's content should be blocked

Let's fix this security issue by implementing custom Strapi middleware.

## Building Secure Middleware in Strapi

Now let's implement the backend security that will ensure users can only access their own content. We'll create custom middleware that automatically filters data based on ownership.

### Generating Middleware with Strapi CLI

First, let's use Strapi's built-in generator to create our middleware template. Navigate to your backend project directory and run:

```bash
yarn strapi generate
```

Select the `middleware` option.

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

We'll name our middleware `is-owner` to clearly indicate its purpose, and we'll add it to the root of the project so it can be used across all our content types.

```bash
? Middleware name is-owner
? Where do you want to add this middleware? (Use arrow keys)
❯ Add middleware to root of project
  Add middleware to an existing API
  Add middleware to an existing plugin
```

Select the `Add middleware to root of project` option and press `Enter`.

```bash
✔  ++ /middlewares/is-owner.js
✨  Done in 327.55s.
```

Perfect! Strapi has created our middleware file at `src/middlewares/is-owner.js`. This file contains a basic template that we'll customize for our needs.

Here's the generated template:

```ts
/**
 * `is-owner` middleware
 */

import type { Core } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In is-owner middleware.');

    await next();
  };
};

```

Now let's replace the template code with our ownership logic:

```ts
/**
 * `is-owner` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In is-owner middleware.");

    const entryId = ctx.params.id;
    const user = ctx.state.user;
    const userId = user?.documentId;

    if (!userId) return ctx.unauthorized(`You can't access this entry`);

    const apiName = ctx.state.route.info.apiName;

    function generateUID(apiName) {
      const apiUid = `api::${apiName}.${apiName}`;
      return apiUid;
    }

    const appUid = generateUID(apiName);

    if (entryId) {
      const entry = await strapi.documents(appUid as any).findOne({
        documentId: entryId,
        populate: "*",
      });

      if (entry && entry.userId !== userId)
        return ctx.unauthorized(`You can't access this entry`);
    }

    if (!entryId) {
      ctx.query = {
        ...ctx.query,
        filters: { ...ctx.query.filters, userId: userId },
      };
    }

    await next();
  };
};
```

### Understanding the Middleware Logic

Our middleware handles two different scenarios:

**Scenario 1: Individual Item Access (findOne)**
- When `entryId` exists, someone is requesting a specific summary
- We check if the summary exists and belongs to the current user
- If it doesn't belong to them, we deny access with an unauthorized error

**Scenario 2: List Access (find)**
- When `entryId` is missing, someone is requesting a list of summaries
- We automatically add a filter to only show summaries owned by the current user
- This ensures users only see their own content without any extra work

### Applying Middleware to Routes

Now we need to tell Strapi when to use our middleware. Let's update the summary routes to include our ownership checks.

Navigate to `src/api/summary/routes/summary.js` in your Strapi project. You should see the existing route configuration:

```js
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

We already have middleware on the `create` route from our previous tutorials. Now we need to add our ownership middleware to the other CRUD operations.

Update the file to include middleware for all operations that need ownership checks:

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
    find: {
      middlewares: ["global::is-owner"],
    },
    findOne: {
      middlewares: ["global::is-owner"],
    },
    update: {
      middlewares: ["global::is-owner"],
    },
    delete: {
      middlewares: ["global::is-owner"],
    },
  },
});
```

Perfect! Now whenever someone tries to access summaries through any of these routes, our middleware will:
- Check if they're accessing their own content
- Filter results to show only their summaries
- Block unauthorized access attempts

### Testing Our Security Implementation

Let's restart our Strapi backend and test our new security measures:

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/07_article_fixing_permission_8426d92786.mp4">
  Your browser does not support the video tag.
</video>

Excellent! Our security is working, but we have a user experience issue. When users try to access a summary that doesn't belong to them, they see a generic error page. Let's improve this.

## Improving User Experience with Custom Error Handling

Instead of showing a generic error page, let's create a user-friendly error boundary that gives users clear information and helpful actions.

Next.js makes this easy - we just need to create an `error.tsx` file in the route where we want to catch errors.

Create a new file at `app/(protected)/dashboard/summaries/[documentId]/error.tsx`:  

``` tsx
"use client"

import { useRouter } from "next/navigation"
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react"

const styles = {
  container:
    "min-h-[calc(100vh-200px)] flex items-center justify-center p-4",
  content: "max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-8",
  textSection: "space-y-4",
  headingError: "text-8xl font-bold text-red-600 select-none",
  headingContainer: "relative",
  pageTitle: "text-4xl font-bold text-gray-900 mb-4",
  description: "text-lg text-gray-600 max-w-md mx-auto leading-relaxed",
  illustrationContainer: "flex justify-center py-8",
  illustration: "relative animate-pulse",
  errorCircle:
    "w-24 h-24 bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-200",
  errorIcon: "w-16 h-16 text-red-500",
  warningBadge:
    "absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center animate-bounce",
  warningSymbol: "text-orange-500 text-xl font-bold",
  buttonContainer:
    "flex flex-col sm:flex-row gap-4 justify-center items-center",
  button: "min-w-[160px] bg-red-600 hover:bg-red-700 text-white",
  buttonContent: "flex items-center gap-2",
  buttonIcon: "w-4 h-4",
  outlineButton: "min-w-[160px] border-red-600 text-red-600 hover:bg-red-50",
  errorDetails:
    "mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left text-sm text-red-800",
  errorTitle: "font-semibold mb-2",
}

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Large Error Text */}
        <div className={styles.textSection}>
          <h1 className={styles.headingError}>Error</h1>
          <div className={styles.headingContainer}>
            <h2 className={styles.pageTitle}>Failed to load summaries</h2>
            <p className={styles.description}>
              We encountered an error while loading your summaries. This might be a temporary issue.
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className={styles.illustrationContainer}>
          <div className={styles.illustration}>
            <div className={styles.errorCircle}>
              <AlertTriangle className={styles.errorIcon} />
            </div>
            <div className={styles.warningBadge}>
              <span className={styles.warningSymbol}>!</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button
            onClick={reset}
            className={`${styles.button} px-6 py-3 rounded-lg font-medium transition-colors`}
          >
            <div className={styles.buttonContent}>
              <RefreshCw className={styles.buttonIcon} />
              Try Again
            </div>
          </button>

          <button
            onClick={() => router.back()}
            className={`${styles.outlineButton} px-6 py-3 rounded-lg font-medium border-2 transition-colors inline-flex`}
          >
            <div className={styles.buttonContent}>
              <ArrowLeft className={styles.buttonIcon} />
              Go Back
            </div>
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className={styles.errorDetails}>
            <div className={styles.errorTitle}>
              Error Details (Development Only):
            </div>
            <div>Message: {error.message}</div>
            {error.digest && <div>Digest: {error.digest}</div>}
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

```

This custom error page will now handle authorization errors gracefully instead of showing the generic global error page.

Let's test it by trying to access a summary that belongs to another user:

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/07_article_route_error_71f741da64.mp4">
  Your browser does not support the video tag.
</video>

Much better! Now users get a clear, helpful error page with options to try again or go back, rather than a confusing generic error.

## What We've Accomplished

Congratulations! We've built a comprehensive, secure system for managing video summaries. Let's review what we've implemented:

### Frontend Achievements
- **Modern Server Actions**: Implemented update and delete functionality using Next.js 15's server actions
- **Robust Validation**: Added client and server-side validation with Zod schemas
- **Great User Experience**: Form state preservation, success messages, and clear error feedback
- **Clean Architecture**: Separated concerns between validation, services, actions, and UI components

### Backend Security 
- **Custom Middleware**: Created ownership-checking middleware that runs on every request
- **Automatic Filtering**: Users automatically see only their own content
- **Access Control**: Prevents users from accessing or modifying others' summaries
- **Route Protection**: Applied middleware to all CRUD operations

### User Experience Enhancements
- **Custom Error Pages**: Friendly error handling instead of generic error messages
- **Clear Feedback**: Users know exactly what went wrong and how to fix it
- **Smooth Interactions**: Updates work instantly, deletes redirect appropriately

### Technical Benefits
- **Scalable Security**: Middleware works for any content type, not just summaries  
- **Type Safety**: Full TypeScript coverage throughout the application
- **Maintainable Code**: Following established patterns makes future development easier
- **Production Ready**: Proper error handling and security make this deployment-ready

## Next Steps

In our next tutorial, we'll explore advanced features like search functionality and pagination to handle large amounts of summary data efficiently.

Thanks for following along with this tutorial! You now have a solid foundation for building secure, user-specific CRUD operations in your Next.js applications.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.


Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

Paul
