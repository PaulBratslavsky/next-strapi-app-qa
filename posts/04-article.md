In the previous tutorial, we completed our **Home Page**. Now we'll build out our **Sign In** and **Sign Up** pages and implement the authentication logic to enable user registration and login.

- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-14-tutorial-learn-next-js-by-building-a-real-life-project-part-1-2)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-14-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishing up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-14-tutorial-learn-next-js-by-building-a-real-life-project-part-3)
- **Part 4: How to handle login and Authentication in Next.js**
- [Part 5: Building out the Dashboard page and uploading file using NextJS server actions](https://strapi.io/blog/epic-next-js-14-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with OpenAI Function](https://strapi.io/blog/epic-next-js-14-tutorial-part-6-create-video-summary-with-next-js-and-open-ai)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-14-tutorial-part-7-next-js-and-strapi-crud-permissions)
- [Part 8: Search & pagination](https://strapi.io/blog/epic-next-js-14-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-14-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-14-tutorial-part-10-frontend-deployment-to-vercel)

Let's start by creating our routes.

## How To Group Routes In Next.js

Next.js allows us to group routes and create shared layouts. You can read more [here](https://nextjs.org/docs/app/building-your-application/routing/colocation#route-groups). For our use case, we'll create a route group called `auth`. To create a route group, you create a folder with a name enclosed in parentheses.

Our folder structure will look like the following.

![002-shared-routes.png](https://api-prod.strapi.io/uploads/002_shared_routes_777a620c19.png)

- A folder named `(auth)`
- Inside the `(auth)` folder, create two additional folders: `signin` and `signup`, each with a blank `page.tsx` file
- Finally, inside the `(auth)` folder, create a file called `layout.tsx` to serve as our shared layout between the `signin` and `signup` pages

You can learn more about the `layout.tsx` file in Next.js docs [here](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts)

Now that we have our basic folder structure, let's create the following components.

In the `layout.tsx` file, paste the following code.

```tsx
export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
```

Paste the following code in the `signin/page.tsx` file.

```tsx
export default function SignInRoute() {
  return <div>Sign In Route</div>;
}
```

Paste the following code in the `signup/page.tsx` file.

```tsx
export default function SingUpRoute() {
  return <div>Sign Up Route</div>;
}
```

After creating these components, you should be able to navigate to our `signin` page via the link.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_signin_page_6bf9e3b45c.mp4">
  Your browser does not support the video tag.
</video>

## Building Our Signin and Signup Form

Let's navigate to `app/components` and create a new folder called `forms`. Inside that folder, create two new files: `signin-form.tsx` and `signup-form.tsx`, and paste the following code for the respective components.

`signin-form.tsx`

```tsx
"use client";
import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

export function SigninForm() {
  return (
    <div className={styles.container}>
      <form>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign In</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
```

`signup-form.tsx`

```tsx
"use client";
import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

export function SignupForm() {
  return (
    <div className={styles.container}>
      <form>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Since we're using **Shadcn UI**, we need to install the `card`, `input`, and `label` components that we're using in the code above.

You can learn more about **Shadcn UI** [here](https://ui.shadcn.com/docs)

We can install the components by running the following command:

```bash
  npx shadcn@latest add card label input
```

Now that we've installed our components, let's navigate to `app/(auth)/signin/page.tsx` and import our newly created `SigninForm` component.

The final code should look like the following.

```tsx
import { SigninForm } from "@/components/forms/signin-form";

export default function SingInRoute() {
  return <SigninForm />;
}
```

Let's do the same for the `signup/page.tsx` file by updating it as follows:

```tsx
import { SignupForm } from "@/components/forms/signup-form";

export default function SingUoRoute() {
  return <SignupForm />;
}
```

Now restart your frontend Next.js application. You should see the following when navigating to the **Sign In** page:

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/004_sign_in_sign_up_forms_04aa59d412.mp4">
  Your browser does not support the video tag.
</video>

Excellent! We now have both of our forms. Before diving into the details of implementing form submission via **Server Actions**, here are some great resources to learn more about the process: [MDN HTML Forms](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) and specific to Next.js [Server Action & Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

Now let's dive into building out our `SignupForm`.

## Form Submission Using Next.js Server Actions

We'll first focus on our `SignupForm`, and then, after we understand how things work, we'll make the same changes to our `SigninForm`.

While building our form, let's consider these key concepts in the context of Next.js:

- We can get form values via the `name` attribute in the `input` fields inside the form
- The form will have an action attribute pointing to a server action
- When we click the submit `button`, it will submit the form and trigger our action
- We'll be able to access our data inside the server action via FormData
- Inside the server action, our business logic will handle signup via our **Strapi** backend

Let's start by defining our first Next.js server action. Navigate to `src/app/data` and create a new folder called `actions` with `index.ts` and `auth.ts` files.

Inside our newly created `auth.ts` file, let's paste the following code:

```ts
"use server";

export async function registerUserAction(formData: FormData) {
  console.log("Hello From Register User Action");
}
```

And in the `index.ts` file, paste the following:

```ts
import { registerUserAction } from "./auth";

export const actions = {
  auth: {
    registerUserAction,
  },
};
```

Now let's import our `registerUserAction` in our `signup-form.tsx` file and add it to our form action.

```jsx
import { actions } from "@/data/actions";
```

Update the form action attribute with the following:

```tsx
{
  /*  rest of our code  */
}
      <form action={actions.auth.registerUserAction}>
{
  /*  rest of our code  */
}
```

Now, you should be able to click the `Sign Up` button, and we should see our console log in our terminal since it's being executed on the server.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/004_article_server_action_test_6fb5dc7781.mp4">
  Your browser does not support the video tag.
</video>

Excellent! Now that we know how to trigger our `server action` via form submission, let's examine how we can access our form data via **FormData**.

## How To Access FormData Inside Next.js Server Action

For additional reading, I recommend checking out [this post](https://developer.mozilla.org/en-US/docs/Web/API/FormData) about **FormData** on MDN, but we'll be using the `get` method to retrieve our values.

When we submit our form, the values will be passed to our server action via FormData using the input `name` attribute as the key for our value.

For example, we can retrieve our data using `FormData.get("username")` for the following input.

![006-input-example.png](https://api-prod.strapi.io/uploads/006_input_example_cdefd4f8f5.png)

Let's update our `registerUserAction` action in the `auth.ts` file with the following code:

```ts
"use server";

export async function registerUserAction(formData: FormData) {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  console.log("#############");
  console.log(fields);
  console.log("#############");
}
```

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_form_items_05b6594089.mp4">
  Your browser does not support the video tag.
</video>

Now, fill out the fields in the **Signup form** and click the **Sign Up** button. You should see the following console log in your terminal.

```bash
Hello From Register User Action
#############
{
  username: 'testuser',
  password: 'testuser',
  email: 'testuser@email.com'
}
#############
```

We can now get our data in our `server action`, but how do we return or validate it?

That's what we'll cover in our next section.

## How To Get Form State With useActionState Hook

We'll use React's `useActionState` hook to return data from our `server action`. You can learn more [here](https://react.dev/reference/react/useActionState).

Back in the `signup-form.tsx` file.

We'll first import our `useActionState` hook from `react-dom`:

```tsx
import { useActionState } from "react";
```

Now, let's create a variable to store our initial state:

```tsx
const INITIAL_STATE = {
  data: null,
};
```

Now let's use our `useActionState` hook:

```tsx
const [formState, formAction] = useActionState(
  actions.auth.registerUserAction,
  INITIAL_STATE
);

console.log("## will render on client ##");
console.log(formState);
console.log("###########################");
```

And update the `form` action attribute with the following:

```jsx
  <form action={formAction}>
```

The completed code should look like the following.

```tsx
"use client";
import { useActionState } from "react";
import Link from "next/link";
import { actions } from "@/data/actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE = {
  data: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  );

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");
  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Finally, we need to update our `registerUserAction` action in the `auth.ts` file using the following code:

```ts
"use server";

export async function registerUserAction(prevState: any, formData: FormData) {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  console.log("#############");
  console.log(fields);
  console.log("#############");

  return {
    ...prevState,
    data: fields,
  };
}
```

We'll fix the use of `any` in a bit when we use Zod for validation.

When you submit the form, you should see our data console logged in our frontend via the `console.log(formState);` that we have in our `signup-form.tsx` file.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_form_action_state_87329dcf83.mp4">
  Your browser does not support the video tag.
</video>

This is great! We can pass data to our `server action` and return it via `useActionState`.

Before we see how to submit our form and sign up via our Strapi backend, let's examine how to handle form validation with Zod.

## Form Validation In Next.js with Zod

**Zod** is a validation library designed for use with TypeScript and JavaScript. In this project we'll be using the newly released Zod 4.

You can reference the following to see what has changed [docs](https://zod.dev/v4/changelog).

It offers an expressive syntax for creating complex validation schemas, which makes Zod particularly useful for validating user-generated data, such as information submitted through forms or received from API requests, to ensure the data aligns with your application's expected structures and types.

Let's examine how we can add Zod validation for our forms. We'll choose to do the validation inside our `server action`.

Let's start by installing **Zod** with the following command:

```bash
yarn add zod
```

Once the installation is complete, go to the data directory, create a new folder named `validation`, then add a file called `auth.ts` with the following code:

```ts
import { z } from "zod";

export const SigninFormSchema = z.object({
  identifier: z
    .string()
    .min(3, "Username or email must be at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export type SigninFormValues = z.infer<typeof SigninFormSchema>;
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export type FormState = {
  success?: boolean;
  message?: string;
  data?: {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    identifier?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  } | null;
};
```

Here, we're setting up two **Zod** schemas—one for signing in and one for signing up—along with a FormState type to help us track what's happening with our form.

- **SigninFormSchema** validates that the identifier (username or email) is at least 3 characters long, and the password is between 6 and 100 characters
- **SignupFormSchema** validates that the username is between 3 and 20 characters, the email is valid, and the password follows the same 6–100 character rule

We also have some TypeScript types:

- **SigninFormValues** and **SignupFormValues** give us the exact shape of valid form data for each schema
- **FormState** keeps track of:
  - Whether the request was successful and any message we want to show
  - The actual form data we're working with
  - Any **Zod** validation errors before the form even gets sent
  - Any **Strapi API** errors we'll handle once we hook this up to our backend later in the tutorial

Now, let's update our `registerUserAction` to use our schema to validate our fields by making the following changes:

```ts
"use server";

import { z } from "zod";
import { SignupFormSchema, type FormState } from "@/data/validation/auth";

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  // TODO: WE WILL ADD STRAPI LOGIC HERE LATER

  return {
    success: true,
    message: "User registration successful",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}
```

In the above code, we’re using Zod to validate the data submitted from our user registration form.

The SignupFormSchema.safeParse() method checks the username, password, and email values extracted from the formData.

If validation fails (validatedFields.success is false), we use z.flattenError() to format the errors, log them, and return the previous form state along with a failure message and the field-specific error details.

If validation succeeds, we log the valid data and return the updated form state with a success flag and message.

This validation step ensures that all registration data meets our defined rules before sending out request to Strapi.

Before testing our form, we just have to make one small change inside our `signup-form.tsx` file.

First let's import our **FormState** type:

```tsx
import { type FormState } from "@/data/validation/auth";
```

And update our `INITIAL_STATE` with the following:

```tsx
const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};
```

The completed code should look like the following:

```tsx
"use client";
import { type FormState } from "@/data/validation/auth";
import { useActionState } from "react";
import Link from "next/link";
import { actions } from "@/data/actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  );

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");
  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Let's test our form by not adding any of our fields and submitting it.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_zod_errors_71ad53ab4a.mp4">
  Your browser does not support the video tag.
</video>

Notice we can see our errors in the front end. Let's create a new component called `ZodErrors` to help us display them inside our `signup-form.tsx` file.

First, navigate to `src/app/components/custom`, create a new file called `zod-errors.tsx`, and paste it into the following code.

```tsx
interface IZodErrorsProps {
  error?: string[];
}

export function ZodErrors({ error }: IZodErrorsProps) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div key={index} className="text-pink-500 text-xs italic mt-1 py-2">
      {err}
    </div>
  ));
}
```

Now, navigate to `src/app/components/forms/signup-form.tsx` and let's use the following component.

We will import and add it to our form and pass the zod errors we are getting back from our `formState`.

The updated `signup-form.tsx` code should look like the following. Also notice that we are using `defaultValue` to populate previously entered field data.

```tsx
"use client";
import { type FormState } from "@/data/validation/auth";
import { useActionState } from "react";
import Link from "next/link";
import { actions } from "@/data/actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ZodErrors } from "@/components/custom/zod-errors";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  );

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");
  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
              />
              <ZodErrors error={formState?.zodErrors?.email} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Now, restart your frontend Next.js project and try submitting the form without entering any data; you should see the following errors.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_missing_values_on_submit_aeb7e88a4b.mp4">
  Your browser does not support the video tag.
</video>

Although our errors show up correctly, notice that are previous field entry disapears. We need to let our form to access previos values, we can do this by using `defaultValue` and passing our previous state via **formState**.

```ts
    defaultValue={formState?.data?.username || ""}
```

The updated code will look like the following:

```tsx
"use client";
import { type FormState } from "@/data/validation/auth";
import { useActionState } from "react";
import Link from "next/link";
import { actions } from "@/data/actions";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ZodErrors } from "@/components/custom/zod-errors";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  );

  console.log("## will render on client ##");
  console.log(formState);
  console.log("###########################");
  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                defaultValue={formState?.data?.username || ""}
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                defaultValue={formState?.data?.email || ""}
              />
              <ZodErrors error={formState?.zodErrors?.email} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                defaultValue={formState?.data?.password || ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign Up</Button>
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Notice now we are able to keep our previos fields entries.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/004_article_fix_form_values_a8f0dc23c8.mp4">
  Your browser does not support the video tag.
</video>

Nice. Now that we have our form validation working, let's move on and create a service that will handle our Strapi Auth Login.

## Authentication with Next.js and Strapi

Now, let's implement Strapi authentication by registering our user via our **Strapi API**. You can find the process explained [here](https://docs.strapi.io/dev-docs/plugins/users-permissions#registration)

The basic overview,

- request to register user to Strapi
- after the user is created, we will get back a JWT token
- save the cookie via the `httpOnly` cookie
- redirect the user to the `dashboard`.
- handle Strapi errors if any exist

Let's start by creating a service that will handle Strapi User Registration.

Navigate to `src/app/data` and create a new folder called `services` inside. Create the file `auth.ts` and paste it into the following code.

```tsx
import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TImage } from "@/types";
import { actions } from "@/data/actions";
import qs from "qs";

type TRegisterUser = {
  username: string;
  password: string;
  email: string;
};

type TLoginUser = {
  identifier: string;
  password: string;
};

type TAuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: TImage;
  credits?: number;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type TAuthResponse = {
  jwt: string;
  user: TAuthUser;
};

type TAuthServiceResponse = TAuthResponse | TStrapiResponse<null>;

// Type guard functions
export function isAuthError(
  response: TAuthServiceResponse
): response is TStrapiResponse<null> {
  return "error" in response;
}

export function isAuthSuccess(
  response: TAuthServiceResponse
): response is TAuthResponse {
  return "jwt" in response;
}

const baseUrl = getStrapiURL();

export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    const data = (await response.json()) as TAuthServiceResponse;
    console.dir(data, { depth: null });
    return data;
  } catch (error) {
    console.error("Registration Service Error:", error);
    return undefined;
  }
}

export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse> {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return response.json() as Promise<TAuthServiceResponse>;
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
}
```

Now, inside the `services` folder, create an `index.ts` file with the following code to export our auth services:

```ts
import { registerUserService, loginUserService } from "./auth";
export const services = {
  auth: {
    registerUserService,
    loginUserService,
  },
};
```

This authentication service module provides a complete interface for handling user authentication with a Strapi backend. Here's what it does:

**Type Definitions:**

- Defines TypeScript types for user registration (`TRegisterUser`), login (`TLoginUser`), and authenticated user data (`TAuthUser`)
- Creates a union type `TAuthServiceResponse` that handles both successful authentication responses and error responses
- Includes type guard functions (`isAuthError`, `isAuthSuccess`) to safely distinguish between success and error responses

**Core Authentication Functions:**

- **`registerUserService`** - Handles user registration by sending POST requests to Strapi's `/api/auth/local/register` endpoint
- **`loginUserService`** - Manages user login through Strapi's `/api/auth/local` endpoint

**Key Features:**

- Proper error handling with try/catch blocks and detailed error responses
- Type-safe responses that can be either successful authentication data or structured error information
- Integration with Strapi's authentication endpoints for a headless CMS setup

This service layer abstracts all the authentication complexity and provides a clean, typed interface for the rest of the application to handle user registration, login, and profile data retrieval.

Now, let's create an `index.ts` to keep with our pattern and export our services:

```ts
import { registerUserService, loginUserService } from "./auth";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
  },
};
```

This includes both our `registerUserService` and `loginUserService`, which is based on what you can find in the Strapi Docs [here](https://docs.strapi.io/dev-docs/plugins/users-permissions#authentication).

Now, we can utilize our `registerUserService` service inside our `auth-actions.ts` file. Let's navigate to that file and add the following to our `registerUserAction`.

Let's import our services.

```tsx
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";
```

And the following:

```tsx
  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  return {
    success: true,
    message: "User registration successful",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}

```

The complete code should look like the following:

```ts
"use server";

import { z } from "zod";
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";

import { SignupFormSchema, type FormState } from "@/data/validation/auth";

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  return {
    success: true,
    message: "User registration successful",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields,
    },
  };
}
```

Notice in the code above, inside of our return we are now returning `strapiErrors`. We will see how to render them in the front in just a moment, but first, let's test our form and see if we can see our `jwt` token being returned in our terminal console and Strapi user in our admin panel.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_registration_works_1d273a05df.mp4">
  Your browser does not support the video tag.
</video>

Nice, we are able to create a new user and register. Before moving on to handling redirects and setting the `httpOnly` cookie, let's create a component to render our Strapi Errors and Make our Submit Button cooler.

## Handling Strapi Errors in Next.js

Now that we have implemented Next.js Strapi authentication, let's ensure that we handle some Strapi errors. Navigate to `src/app/components/custom`, create a new file named `strapi-errors.tsx`, and paste the following code.

```tsx
type TStrapiError = {
  status: number;
  name: string;
  message: string;
  details?: Record<string, string[]>;
};

interface IStrapiErrorsProps {
  error?: TStrapiError | null;
}

export function StrapiErrors({ error }: IStrapiErrorsProps) {
  if (!error?.message) return null;
  return (
    <div className="text-pink-500 text-md italic py-2">{error.message}</div>
  );
}
```

Now navigate back to our `signup-form.tsx` file, import our newly created component, and add it right after our' submit' button.

```tsx
import { StrapiErrors } from "@/components/custom/strapi-errors";
```

```jsx
<CardFooter className={styles.footer}>
  <Button className={styles.button}>Sign Up</Button>
  <StrapiErrors error={formState?.strapiErrors} />
</CardFooter>
```

Let's test and see if we can see our Strapi Errors. Try creating another user with an email you used to make your first user.

You should see the following message.

![Screenshot 2025-08-18 at 1.31.48 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_18_at_1_31_48_AM_ab73ff9bf9.png)

Let's improve our `submit` button by adding a pending state and making it prettier.

## How To Handle Pending State In Next.js With useFormStatus

When we submit a form, it may be in a pending state, and we would like to show a spinner for a better user experience.

Let's look at how we can accomplish this by creating a `SubmitButton` component that will utilize the `useFormStatus` hook. The Next.js docs provide more details [here](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#pending-states).

The `useFormStatus` Hook gives you the status information of the last form submission. We will use that to get the status of our form and show our loading spinner.

Let's start by navigating to `app/components/custom`, creating the following file name `submit-button.tsx`, and adding the following code.

```tsx
"use client";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Loader({ text }: { readonly text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <p>{text}</p>
    </div>
  );
}

interface IButtonProps {
  text: string;
  loadingText: string;
  className?: string;
  loading?: boolean;
}

export function SubmitButton({
  text,
  loadingText,
  loading,
  className,
}: IButtonProps) {
  const status = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={status.pending || loading}
      disabled={status.pending || loading}
      className={cn(className)}
    >
      {status.pending || loading ? <Loader text={loadingText} /> : text}
    </Button>
  );
}
```

Now that we have our new **SubmitButton** component, let's use it inside our `signup-form.tsx` file.

Let's replace our boring `button` with the following, but first, ensure you import it.

```jsx
import { SubmitButton } from "@/components/custom/submit-button";
```

Inside our `CardFooter`, let's update you with the following:

```tsx
<CardFooter className={styles.footer}>
  <SubmitButton className="w-full" text="Sign Up" loadingText="Loading" />
  <StrapiErrors error={formState?.strapiErrors} />
</CardFooter>
```

Now let's test our new beautiful button.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_submit_button_4a0b9a1b65.mp4">
  Your browser does not support the video tag.
</video>

It's beautiful.

The last two things we need to do are to look at how to set our **JWT** token as a `httpOnly` cookie, handle redirects, and set up protected routes with the `middleware.ts` file.

## How To Set HTTP Only Cookie in Next.js

We will add this logic to our `src/data/actions/auth` file in our `registerUserAction` function.

You can learn more about setting cookies in Next.js on their docs [here](https://nextjs.org/docs/app/api-reference/functions/cookies)

Let's make the following change inside of our `registerUserAction` file.

First import `cookies` and `redirect` from Next:

```ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
```

Next, create a variable to store our `cookies` config.

```ts
const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
```

Finally, use the following code to set the cookie.

```ts
const cookieStore = await cookies();
cookieStore.set("jwt", responseData.jwt, config);
redirect("/dashboard");
```

You can now remove the following last return since we will never reach it due to our redirect.

```ts
return {
  success: true,
  message: "User registration successful",
  strapiErrors: null,
  zodErrors: null,
  data: {
    ...prevState.data,
    ...fields,
  },
};
```

The final code should look like the following. Notice we are using the `redirect` function from Next.js to redirect the user to the `dashboard` page; you can learn more [here](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function).

```ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";

import { SignupFormSchema, type FormState } from "@/data/validation/auth";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}
```

Notice we are redirecting to our `dashboard` route; Let's make this page now.

Inside the app folder, create a new folder named `(protected)`. Within that, add a `dashboard` folder, and inside it create a `page.tsx` file.

Paste the following code into page.tsx:

```tsx
export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Dashboard</h1>
    </div>
  );
}
```

Let's create another user and see our redirect in action and our cookies set.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_signup_with_redirect_a4aae7ec50.mp4">
  Your browser does not support the video tag.
</video>

You can see here that we are saving it as an `httpOnly` cookie.

![015-cookie.png](https://api-prod.strapi.io/uploads/015_cookie_2b6f783a69.png)

Nice. We are almost done with the authentication flow, but we still have a small issue. If I remove the cookie, we are still able to navigate to the `dashboard,` but that should be a protected route.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_not_protected_dashboard_9f5e7efa2e.mp4">
  Your browser does not support the video tag.
</video>

## How To Protect Your Routes in Next.js via Middleware

We will use Next.js `middleware` to protect our routes. You can learn more [here](https://nextjs.org/docs/app/api-reference/file-conventions/middleware).

In the `src` folder, create a file called `middleware.ts` and paste it into the following code.

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { services } from "@/data/services";

// Define an array of protected routes
const protectedRoutes: string[] = ["/dashboard", "/dashboard/*"];

// Helper function to check if a path is protected
function isProtectedRoute(path: string): boolean {
  if (!path || protectedRoutes.length === 0) return false;
  return protectedRoutes.some((route) => {
    // For exact matches
    if (!route.includes("*")) {
      return path === route;
    }

    // For wildcard routes (e.g., /dashboard/*)
    const basePath = route.replace("/*", "");
    return path === basePath || path.startsWith(`${basePath}/`);
  });
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // Only validate authentication for protected routes
  if (isProtectedRoute(currentPath)) {
    try {
      // Validate user using getUserMe service - this checks:
      // 1. Token exists and is valid
      // 2. User exists in database
      // 3. User account is active (not blocked/deleted)
      const userResponse = await services.auth.getUserMeService();

      // If user validation fails, redirect to signin
      if (!userResponse.success || !userResponse.data) {
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      // User is valid, continue to protected route
      return NextResponse.next();
    } catch (error) {
      // If getUserMe throws an error, redirect to signin
      console.error("Middleware authentication error:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}
// Configure matcher for better performance
export const config = {
  matcher: [
    // Match /dashboard and any path under /dashboard
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
```

In the code above, we are using the `getUserMeService` let's go ahead and add it in our `src/data/services/auth.ts`.

```ts
export async function getUserMeService(): Promise<TStrapiResponse<TAuthUser>> {
  const authToken = await actions.auth.getAuthTokenAction();

  if (!authToken)
    return { success: false, data: undefined, error: undefined, status: 401 };

  const url = new URL("/api/users/me", baseUrl);

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.error)
      return {
        success: false,
        data: undefined,
        error: data.error,
        status: response.status,
      };
    return {
      success: true,
      data: data,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        details: {},
      },
      status: 500,
    };
  }
}
```

It is responsible for checking in with Strapi and confirming authenticated user.

Don't forget to export it from the `index.ts` file:

```ts
import {
  registerUserService,
  loginUserService,
  getUserMeService,
} from "./auth";
export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
};
```

The complete file should look like the following:

```ts
import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse, TImage } from "@/types";
import { actions } from "@/data/actions";
import qs from "qs";

type TRegisterUser = {
  username: string;
  password: string;
  email: string;
};

type TLoginUser = {
  identifier: string;
  password: string;
};

type TAuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: TImage;
  credits?: number;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

type TAuthResponse = {
  jwt: string;
  user: TAuthUser;
};

type TAuthServiceResponse = TAuthResponse | TStrapiResponse<null>;

// Type guard functions
export function isAuthError(
  response: TAuthServiceResponse
): response is TStrapiResponse<null> {
  return "error" in response;
}

export function isAuthSuccess(
  response: TAuthServiceResponse
): response is TAuthResponse {
  return "jwt" in response;
}

const baseUrl = getStrapiURL();

export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    const data = (await response.json()) as TAuthServiceResponse;
    console.dir(data, { depth: null });
    return data;
  } catch (error) {
    console.error("Registration Service Error:", error);
    return undefined;
  }
}

export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse> {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return response.json() as Promise<TAuthServiceResponse>;
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
}

export async function getUserMeService(): Promise<TStrapiResponse<TAuthUser>> {
  const authToken = await actions.auth.getAuthTokenAction();

  if (!authToken)
    return { success: false, data: undefined, error: undefined, status: 401 };

  const url = new URL("/api/users/me", baseUrl);

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    if (data.error)
      return {
        success: false,
        data: undefined,
        error: data.error,
        status: response.status,
      };
    return {
      success: true,
      data: data,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        details: {},
      },
      status: 500,
    };
  }
}
```

Notice that our `getUserMeService` is calling `getAuthTokenAction()`. In the`src/data/actions/auth.ts` let's add the following code:

```ts
export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}
```

Notice tha we also added `logoutUserAction()` it will be responsible for clearing out the cookie when logging out.

The final file should look like the following:

```ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";

import { SignupFormSchema, type FormState } from "@/data/validation/auth";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}

export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}
```

Don't forget to add to the export in the `index.ts` file:

```ts
import {
  registerUserAction,
  logoutUserAction,
  getAuthTokenAction,
} from "./auth";

export const actions = {
  auth: {
    registerUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
};
```

Now let's create a log out button that we can use in our dashboard. Navigate to `src/components/custom` and create a file called `logout-button` and paste in the following:

```tsx
import { actions } from "@/data/actions";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={actions.auth.logoutUserAction}>
      <button type="submit">
        <LogOut className="w-6 h-6 hover:text-primary" />
      </button>
    </form>
  );
}
```

Now let's add it in our `app/(protected)dashboard/page.tsx` file:

```tsx
import { LogoutButton } from "@/components/custom/logout-button";

export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
```

Now let's create a new user, logout, and try to navigate to the the dashboard, you will notice, we will be redirected to our **login** route.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_article_working_protect_middleware_5ed4153c84.mp4">
  Your browser does not support the video tag.
</video>

Nice. Great job.

Nice. Now that we know our `middleware` is working, let's work on hooking up our `SigninForm` instead of going step by step like we did. Since we will basically do the same thing we did in the `SignupForm,` we are just going to paste in the completed code.

Let's update the `sign-form.tsx` file with the following.

```tsx
"use client";
import { actions } from "@/data/actions";
import { useActionState } from "react";
import { type FormState } from "@/data/validation/auth";

import Link from "next/link";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    INITIAL_STATE
  );

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
                defaultValue={formState?.data?.identifier || ""}
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                defaultValue={formState?.data?.password || ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <SubmitButton
              className="w-full"
              text="Sign In"
              loadingText="Loading"
            />
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
```

Our form expects our `loginUserAction`, let's add it in our `src/data/actions/auth.ts` file:

```ts
export async function loginUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Login User Action");

  const fields = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  console.dir(fields);

  const validatedFields = SigninFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.loginUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Login Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}
```

Our `loginUserAction` is expecting the `SigninFormSchema`, let's add the following import:

```ts
import {
  SignupFormSchema,
  SigninFormSchema,
  type FormState,
} from "@/data/validation/auth";
```

And don't forget to add it you our export in the `index.ts` file:

```ts
import {
  registerUserAction,
  loginUserAction,
  logoutUserAction,
  getAuthTokenAction,
} from "./auth";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
};
```

The completed file will look like the following:

```ts
"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";

import {
  SignupFormSchema,
  SigninFormSchema,
  type FormState,
} from "@/data/validation/auth";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

export async function loginUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("Hello From Login User Action");

  const fields = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  console.dir(fields);

  const validatedFields = SigninFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed:", flattenedErrors.fieldErrors);
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

  console.log("Validation successful:", validatedFields.data);

  const responseData = await services.auth.loginUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Login Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, config);
  redirect("/dashboard");
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}

export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}
```

Nice, our signin form should now work, let's try it out:

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/04_testing_signin_form_9216d11aee.mp4">
  Your browser does not support the video tag.
</video>


## Conclusion

In this Next.js tutorial, we successfully built the Sign In and Sign Up pages for a Next.js application.

We implemented custom Sign In and Sign Up forms with error handling and integrated them with a backend using server actions.

Using useActionState and Zod for form validation ensured data integrity and provided user feedback.

We also covered setting up httpOnly cookies for secure authentication and protecting routes through Next.js middleware, establishing a solid foundation for user authentication flows in Next.js applications.

Thank you for your time, and I hope you are enjoying these tutorials.

If you have any questions, you can ask them in the comments or stop by Strapi's `open office` on Discord from 12:30 pm CST to 1:30 pm CST Monday through Friday.

See you in the next post, where we will work on building our dashboard.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

If you have a suggestion or find a mistake in the post, please open an issue on the [GitHub repository](https://github.com/PaulBratslavsky/epic-next-15-strapi-5).

Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

[Project Repo]()

Happy coding!

Paul
