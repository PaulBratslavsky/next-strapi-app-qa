Hello, you wonderful people; in this post of many, I would like to introduce you to what we will be building.

This post is the first of many in our Epic Strapi Next.js 15 tutorial Series. You can find the outline for upcoming post here.

- **Part 1: Learn Next.js by building a website**
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-14-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishup up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-14-tutorial-learn-next-js-by-building-a-real-life-project-part-3)
- [Part 4: How to handle login and Authentification in Next.js](https://strapi.io/blog/epic-next-js-14-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: Building out the Dashboard page and upload file using NextJS server actions](https://strapi.io/blog/epic-next-js-14-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with OpenAI Function](https://strapi.io/blog/epic-next-js-14-tutorial-part-6-create-video-summary-with-next-js-and-open-ai)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-14-tutorial-part-7-next-js-and-strapi-crud-permissions)
- [Part 8: Search & pagination in Nextjs](https://strapi.io/blog/epic-next-js-14-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-14-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-14-tutorial-part-10-frontend-deployment-to-vercel)

With the popularity of Next.js 15 and Strapi headless CMS and how they can empower you to build cool things, we are going to work on building a project together to cover all the awesome aspects of Next.js 15, the app folder, and all the new features including server components and server actions.

In this post, we will quickly look at what we will build and the topics we will cover, set up the basic structure of our project, and make our first commitment.

So, what will we be building?

## Summarize AI - A Modern Full-Stack Video Summary Application

We'll be building **Summarize AI**, a comprehensive full-stack application that solves a common problem: spending too much time on videos that don't deliver the value you're seeking.

### The Problem We're Solving

Have you ever found yourself halfway through a YouTube video, realizing you could have saved time if you'd known the content wasn't quite what you needed? Or wished you could quickly review the key points from educational videos you've watched?

**Summarize AI** addresses these challenges by providing:

- **AI-powered video summaries** to help you decide if content is worth your time
- **Organized content management** to reference your learning materials later
- **User authentication and profiles** for a personalized experience

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/demo_6425173e50.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 🏗️ Project Architecture Overview

This is a modern full-stack application with a clear separation of concerns:

### Project Structure

```
epic-next-course/
├── frontend/          # Next.js 15 application
│   ├── src/
│   │   ├── app/           # App Router with route groups
│   │   │   ├── (auth)/    # Authentication routes
│   │   │   ├── (protected)/ # Protected dashboard routes
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── custom/    # Project-specific components
│   │   │   ├── forms/     # Form components with validation
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── data/
│   │   │   ├── actions/   # Server actions
│   │   │   ├── services/  # API service functions
│   │   │   └── validation/ # Zod schemas
│   │   └── types/         # TypeScript definitions
│   └── package.json
└── backend/           # Strapi CMS
    ├── src/
    │   ├── api/           # Custom API routes
    │   ├── components/    # Reusable content components
    │   └── content-types/ # Data models
    └── package.json
```

## 🛠️ Complete Tech Stack

### Frontend Technologies

- **Framework**: [Next.js 15.4.6](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org) (strict mode enabled)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with modern utilities
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) built on Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev) for consistent iconography
- **Notifications**: [Sonner](https://sonner.emilkowal.ski) for elegant toast messages
- **Forms**: Server Actions with [Zod](https://zod.dev) validation
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai) for seamless AI functionality

### Backend Technologies

- **CMS**: Strapi v5 headless content management
- **Database**: SQLite (better-sqlite3) for development
- **Authentication**: JWT-based authentication system
- **API**: REST API with custom controllers and middleware

### Development & Quality Tools

- **Linting**: ESLint with Next.js and TypeScript configurations
- **Code Quality**: TypeScript strict mode for enhanced type safety
- **Error Handling**: Centralized error management with boundaries
- **State Management**: React Server Components with server state

## ✨ Core Features We'll Build

### Authentication System

- **User Registration & Login**: Secure JWT-based authentication
- **Protected Routes**: Middleware-based route protection
- **Profile Management**: User profiles with image upload capabilities
- **Session Management**: Automatic token refresh and logout handling

### Video Summary Management

- **AI-Powered Summaries**: Integration with AI services for content generation
- **CRUD Operations**: Create, read, update, and delete summaries
- **Search & Pagination**: Debounced search with URL state management
- **Content Organization**: Categorize and organize your video summaries

### User Experience Features

- **Real-time Search**: Instant search with 300ms debouncing
- **Loading States**: Skeleton components for better perceived performance
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Toast Notifications**: User feedback for all actions

### Content Management (Strapi)

- **Dynamic Content**: Flexible page building with dynamic zones
- **Media Handling**: File uploads for user profiles and content
- **API Permissions**: Role-based access control
- **Content Relationships**: User associations and content linking

## 🎯 Next.js 15 Features We'll Explore

- **App Router**: Modern routing with layouts and route groups
- **Server Components**: Efficient server-side rendering
- **Server Actions**: Form handling without API routes
- **Middleware**: Route protection and request processing
- **Data Fetching**: Built-in caching and revalidation
- **Loading UI**: Streaming and loading states
- **Error Boundaries**: Graceful error handling
- **TypeScript Integration**: Full type safety throughout

## Project Overview

### Home Page

We will have a basic landing page with a top nav, hero sections, a benefits section, and a footer.

All the top nav, hero section, and footer content will be stored inside our Strapi instance.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/dashboard_9b9d04fe52.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Login and Register Page

We will handle auth using Strapi and protect our routes via the Next middleware file to check if an authorized user exists and redirect accordingly.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/auth_account_1aa78fa8ee.mp4">
  Your browser does not support the video tag.
</video>

### Dashboard and Account Page

We will have a simple dashboard with a primary view showing available credits and summaries. As well as, our account page, where we can update our users's first and last names and bio. As well as change our photo.

**Generate Summary**

Here, you will enter your YouTube video url, and it will make a call to Open AI via AI SDK to generate our summary based on the YouTube video transcript.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/save_to_strapi_57391d890e.mp4">
  Your browser does not support the video tag.
</video>

I hope you are excited to embark on this journey with me.

## The Process and Why It Is Awesome

My goal is to build this tutorial in public and release new post/video per week.

All the progress will be saved in a public repo where you can follow along.

The goal is to build out our application that you can use later to add or extend in any way you desire.

We will cover all the important parts of Next.js and some features related to Strapi, such as middlewares, policies, routes, controllers, and services.

I hope you are just as excited as I am.

So let's get started.

## Setting Up Our Initial Project

Let's start by setting up our front end first. For this, we will be using [Next.js 15](https://nextjs.org)

### Setting Up Our Frontend

Let's start by creating a new folder called `epic-next-course,` I am going to do this in my terminal by running the following command:

```bash
  mkdir epic-next-course
```

Once we created our folder, let's navigate inside of it by typing `cd epic-next-course` and run the following command:

```
  npx create-next-app@latest
```

Select the following options:

```bash
paul@dev epic-next-course %   npx create-next-app@latest

✔ What is your project named? … frontend
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for `next dev`? … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
Creating a new Next.js app in /Users/paul/Desktop/Working/epic-next-course/frontend.
```

Once your project has been created, let's navigate to our frontend folder with `cd frontend` and run `yarn dev` to start our frontend project.

Your project will start at [http://localhost:3000](http://localhost:3000).

![next-js-web.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/next_js_web_e06505728d.png)

### Setting Up Shadcn UI for styling

We will use Tailwind with Shadcn UI components to make our app pretty. Shadcn UI is excellent because it allows you to install your UI components directly into your codebase and modify/extend them accordingly.

You can learn more [here](https://ui.shadcn.com).

![shadcn-ui.png](https://api-prod.strapi.io/uploads/shadcn_ui_0f155fbb09.png)

Let's now go through the setup steps. You can also reference [this] guide (https://ui.shadcn.com/docs/installation/next).

**Run the CLI**
Run the shadcn-ui init command:

```bash
  npx shadcn@latest init
```

And follow the prompts on screen.

```bash
➜  frontend git:(01-post) ✗   npx shadcn@latest init

✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS config. Found v4.
✔ Validating import alias.
✔ Which color would you like to use as the base color? › Neutral
✔ Writing components.json.
✔ Checking registry.
✔ Updating CSS variables in src/app/globals.css
✔ Installing dependencies.
✔ Created 1 file:
  - src/lib/utils.ts

Success! Project initialization completed.
You may now add components.
```

That's it. We now have Shadcn UI installed and ready to go.

You will see the new `utils` folder and `components.json` file.

![component-file.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/component_file_f0e96d2043.png)

Let's add our first component by running the following command in your `frontend` folder, which will install our button component.

```bash
  npx shadcn@latest add button
```

We now have a button inside our components folder.

![we-have-a-button.png](https://api-prod.strapi.io/uploads/we_have_a_button_773bb330f5.png)

Let's use it inside the `page.tsx` file by replacing all the code with the following.

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto py-6">
      <Button>Our Cool Button</Button>
    </main>
  );
}
```

Look at that amazing button.

![our-new-button.png](https://api-prod.strapi.io/uploads/our_new_button_d6e34ed415.png)

Now that we know that our Shadcn UI component is working as expected. Let's finish up this first tutorial by setting up our Strapi instance.

### Setting Up Our Backend

For our backend, we are going to use Strapi headless CMS. Strapi allows you to build your backend in minutes instead of weeks.

It is highly customizable and easy to get started with.

You can learn more in the [docs](https://docs.strapi.io/dev-docs/quick-start), but we will start by running the following command inside the project folder.

```bash
  npx create-strapi-app@latest backend
```

You will see the following prompt.

```bash
 Strapi   v5.21.0 🚀 Let's create your new project


🚀 Welcome to Strapi! Ready to bring your project to life?

Create a free account and get:
✨ 30 days of access to the Growth plan, which includes:
✅ Single Sign-On (SSO) login
✅ Content History
✅ Releases

? Please log in or sign up.
  Login/Sign up
❯ Skip

```

We will select `skip` and hit enter.

You will be prompted with the following options.

```bash
? Do you want to use the default database (sqlite) ? Yes
? Start with an example structure & data? No
? Start with Typescript? Yes
? Install dependencies with npm? Yes
? Initialize a git repository? No

 Strapi   Creating a new application at /Users/paul/Desktop/Working/epic-next-course/backend

   deps   Installing dependencies with npm
```

To start our Strapi application, we will run the following command.

```bash
  cd backend
  yarn strapi dev
```

Once everything gets installed, you will be greeted by Strapi's register page.

![register-user.png](https://api-prod.strapi.io/uploads/register_user_d6d80f13ec.png)

Go ahead and create your first **admin user**. Once done, you will be greeted by the dashboard.

![Screenshot 2025-08-11 at 11.50.11 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_08_11_at_11_50_11_AM_c12d4d46c2.png)

Congratulations. We now have our Strapi app set up.

In future posts, we will explore the Strapi dashboard in more detail. But for now, let's create our first **collection type**.

## Creating Our First Collection Type

Our app will have a home page with our top navigation, hero section, features, and footer section.

![home-page-layout.png](https://api-prod.strapi.io/uploads/home_page_layout_ce7c66f130.png)

Let's create our first collection type to store this data.

We will get it started in this post and continue it in the next post.

I want to show how easily we can add content to the Strapi application and get that data from our API.

Let's start by navigating to `Content-Type Builder` under `SINGLE TYPES` and clicking on `create-new-single-type.`

We are going to name it `Home Page`.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/01_article_create_first_single_type_361d8c5ed9.mp4">
  Your browser does not support the video tag.
</video>

Text -> Short Text -> title
Text -> Long Text -> description

Once done, click save.

Now, let's add some basic data.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/01_article_adding_data_to_single_type_60fdb89181.mp4">
  Your browser does not support the video tag.
</video>

After adding the title text and description, make sure to click publish.

Not let's take a look at how we can get our data from our API using **Insomnia**, but you can also use **Postman**

In future posts, of course, we will be getting out data from our Next.js frontend.

## Getting Our Data via The Strapi API

Now that we have our first data type let's see how we can query it using **Postman** in VS Code.

But first, we must give Strapi permission to serve those endpoints to our client.

Since this is public data, we can accomplish this with the following permissions.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/01_article_adding_permissions_46cfb849d6.mp4">
  Your browser does not support the video tag.
</video>

Navigate to Settings -> USERS & PERMISSION PLUGIN -> Roles -> Public

Select **Home Page** and check the find checkbox.

We should now be able to access our data by making a `GET` request to `http://localhost:1337/api/home-page`.

Let's give it a try.

![2025-08-11_13-56-17.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/2025_08_11_13_56_17_563b775185.png)

Awesome. We must get our initial **Home Page** data from our endpoint.

```json
{
  "data": {
    "id": 2,
    "documentId": "upcn80a2a51ius5n36sbwlst",
    "title": "Home Page",
    "description": "This is our first single content type.",
    "createdAt": "2025-08-11T17:58:48.636Z",
    "updatedAt": "2025-08-11T17:58:48.636Z",
    "publishedAt": "2025-08-11T17:58:48.641Z"
  },
  "meta": {}
}
```

With introduction of Strapi 5, we now have a cleaner API response with a new key called `documentId`. Which is a unique identifier for content.

Even though we return an `id` in the response, we should use the `documentId` for all our requests.

You can learn more about the changes [here](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/use-document-id).

Before we go, let's call from our front end and see if we can render our initial data.

## Making Our First Fetch Request

Let's see our Next.js and Strapi integration by creating create a basic function to fetch our data inside our Next.js application.

Since we are using Next.js 15, we can use RSC [React Server Components].

Inside our **frontend project**, let's navigate to the `src/app/page.tsx` file.

This is where we added our essential button component to test our CSS.

![home-page-next.png](https://api-prod.strapi.io/uploads/home_page_next_0fd7778971.png)

Let's make the following refactoring to fetch our data.

```tsx
async function getStrapiData(url: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");

  const { title, description } = strapiData.data;

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>
    </main>
  );
}
```

Once you make the following changes, ensure your project is running, and navigate to `http://localhost:3000`, you should see the next.

![our-first-data.png](https://api-prod.strapi.io/uploads/our_first_data_63fd644587.png)

Excellent job; we now know we can get data from our **backend** to our **frontend**.

We will continue building the home page, navigation, and footer in the next post.

## Conclusion

Amazing job, everyone. We did it, we now have our Next.js and Strapi integration. We have jump-started our Next.js 15 and Strapi journey.

We set up both our frontend and backend of our video summarization app. We are now ready to continue building the rest of the project.

Here is the repo for the project with the current progress.

I want to build this out in public, so feel free to add comments and questions in the GitHub issues.

I hope you had as much fun as I did, and I will see you in the next post.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

Feel free to make PRs to fix any issues you find in the project or let me know if you have any questions.

[Project Repo]()

Happy coding!

Paul
