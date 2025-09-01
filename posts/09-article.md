We have completed all the basic features for our YouTube Summarize AI app, which we have been working on. These include full CRUD functionality, authentication, search, pagination, and AI video summarization. If you still need to complete your project, check out our previous posts in this Epic Next.js 14 tutorial series.

- [Part 1: Learn Next.js by building a website](https://strapi.io/blog/epic-next-js-15-tutorial-part-1-learn-next-js-by-building-a-real-life-project)
- [Part 2: Building Out The Hero Section of the homepage](https://strapi.io/blog/epic-next-js-15-tutorial-part-2-building-out-the-home-page)
- [Part 3: Finishup up the homepage Features Section, TopNavigation and Footer](https://strapi.io/blog/epic-next-js-15-tutorial-part-3-finishup-up-the-homepage-features-section-top-navigation-and-footer)
- [Part 4: How to handle login and Authentification in Next.js](https://strapi.io/blog/epic-next-js-15-tutorial-part-4-how-to-handle-login-and-authentication-in-next-js)
- [Part 5: Building out the Dashboard page and upload file using NextJS server actions](https://strapi.io/blog/epic-next-js-15-tutorial-part-5-file-upload-using-server-actions)
- [Part 6: Get Video Transcript with AI SDK](https://strapi.io/blog/epic-next-js-15-tutorial-part-6-create-video-summary-with-next-js-and-ai-sdk)
- [Part 7: Strapi CRUD permissions](https://strapi.io/blog/epic-next-js-15-tutorial-part-7-next-js-and-strapi-crud-permissions)
- [Part 8: Search & pagination in Nextjs](https://strapi.io/blog/epic-next-js-15-tutorial-part-8-search-and-pagination-in-next-js)
- [Part 9: Backend deployment to Strapi Cloud](https://strapi.io/blog/epic-next-js-15-tutorial-part-9-backend-deployment-to-strapi-cloud)
- [Part 10: Frontend deployment to Vercel](https://strapi.io/blog/epic-next-js-15-tutorial-part-10-frontend-deployment-to-vercel)

This post will cover how to deploy your project to **Strapi Cloud**. 

## Why Strapi Cloud

It is the easiest and hassle-free way to deploy your Strapi CMS projects.

**Get Everything You Need to Run Strapi in Production**

Here are some items you get out of the box using Strapi Headless CMS Cloud that you don't have to set up yourself. 

1. **CDN** (Content Delivery Network)—This helps deliver content to users more efficiently by caching content on servers located closer to the user.
2. **Database** - **Strapi Cloud** includes a database for storing and managing the application data.
3. **Email** - **Strapi Cloud** provides email functionality, allowing users to send emails from their applications.
4. **File Storage** - **Strapi Cloud** includes file storage capabilities, allowing users to store and manage files associated with their applications.

You also can access real-time logs, share and collaborate on your project with others, and use many other features. you can learn more about **Strapi Cloud** [here](https://strapi.io/cloud)

Currently, **Strapi Cloud** is a paid feature, but you can try it out for FREE for 14 days (no credit card required). The goal is to eventually have a free-tier. However, since we are an open-source company, Strapi Headless CMS is free for anyone to use. When we started **Strapi Cloud** last year, we targeted small organizations with our $99 offering; we now offer a developer plan at $29 per month, which includes all the features mentioned above.

There are many ways to host your Strapi CMS project, and we encourage you to use the best option available. In the future, I will create another blog post covering Strapi backend deployment to [Render](https://render.com/). The caveat is that when using your own hosting solution, you will be responsible for setting up your own database, file storage, and anything else that is required.

But today, we will take the hassle-free approach and use Strapi Cloud, which offers a FREE 14-day trial.

## Preparing Our Project For Deployment

To deploy your project, you just need a GitHub repo with your project. Since you followed this tutorial, you should be ready to go. 

Here is the repo of my project.

![Screenshot 2025-09-01 at 9.04.00 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_04_00_AM_cdadf2fd65.png)

Let's get started.

## Creating Your Strapi Account 

We will start by creating a **Strapi Cloud** Account. You will use your GitHub account to sign in. To do so, navigate to the [Strapi Cloud Login](https://cloud.strapi.io/login).

You are going to choose GitHub as your login method.

![04-strapi-cloud.png](https://api-prod.strapi.io/uploads/04_strapi_cloud_a325da3186.png)

Once you click on the link, you will see the following screen. Click the `Authorize Strapi Cloud` button.

Now that you have your account, create your first project!

## Create Your First Strapi Project

![05-auth-cloud.png](https://api-prod.strapi.io/uploads/05_auth_cloud_bb5081574b.png)

You should be greeted with the following page. Let's click the `Create Project` button.

![06-create-project.png](https://api-prod.strapi.io/uploads/06_create_project_dbeec64a3e.png)

You will be greeted with the following screen.

![Screenshot 2025-09-01 at 9.07.04 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_07_04_AM_3e811e24b7.png)
Click the `Create my project` button to continue.

We are going to start with the FREE plan, now let import your project via GitHub. Click on the button and follow the steps. 

![08-github-import.png](https://api-prod.strapi.io/uploads/08_github_import_ae43f1fc76.png)

Once you authorize GitHub, you should see the following page. If not, you may need to refresh your browser.

![Screenshot 2025-09-01 at 9.12.35 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_12_35_AM_bd6154f1f1.png)

Notice I chose my GitHub account `PaulBratslavsky` and pointed to my repository `epic-next-strapi-project`.

Let's continue by completing the steps in the **Setup** section. 

![Screenshot 2025-09-01 at 9.14.49 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_14_49_AM_8f4bff646f.png)

I will give my project a **Display Name**, point to my **main** branch, and select **New York** as my region.

Afterward, we will click on the `Show advanced settings` button. Since our `frontend` and `backend` are in the same repo, we need to point to our Strapi CMS project in the `/backend` folder.

![Screenshot 2025-09-01 at 9.16.38 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_16_38_AM_c7d79e8870.png)

I will keep the default node version, and since we don't have any environment variables, I will click on the `Create project` button.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_article_cloud_deploy_75a632191c.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

You should see the following screen.

![12-starting.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/12_starting_bdd8afb5e0.png)

As the process continues, you will be redirected to the following page, where you should see the real-time logs for your deployment process.

![Screenshot 2025-09-01 at 9.27.13 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_27_13_AM_3c4ede2336.png)

Once your project finishes deploying, you should see the following screen. You can continue your project by clicking the `Visit app` button.  

![Screenshot 2025-09-01 at 9.28.48 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_28_48_AM_a3a1a94108.png)

If you get the `This site can't provide a secure connection` message, you have to give it a moment to allow all the changes to propagate. 

![15-message.png](https://api-prod.strapi.io/uploads/15_message_972e6702fe.png)

Once the process is finished, you will be greeted with the **Create Admin** user screen.  

![16-login.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/16_login_d71b5fde13.png)

Go ahead and create your first user. Once you have done so, you will be greeted with the Strapi dashboard screen.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_article_deployed_project_3e083d0ce1.mp4">
[09-article-deployed-project.mp4](https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_article_deployed_project_3e083d0ce1.mp4)
  Your browser does not support the video tag.
</video>

Congratulations, you have deployed your very first Strapi project. 

## How To Transfer Our Local Data To Our Cloud Instance

As a bonus, let's examine how we can transfer local Strapi data to seed our new cloud instance.

Let's start by logging into Strapi cloud, going to our deployed application, and logging in.

In your Strapi admin panel, click on the `Visit App` button. This will take you to your deployed app.

Enter your credentials to log in.

Navigate to `Settings` => `Transfer Tokens` and click the `Add new Transfer Token` button.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_aritcle_create_token_3c22299ed2.mp4">
[09-article-deployed-project.mp4](https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_article_deployed_project_3e083d0ce1.mp4)
  Your browser does not support the video tag.
</video>

Fill it the following options.

**Name**: Transfer
**Description**: Transfer Token
**Token duration**: 7 days
**Token type** Full Access

And finally, click the `Save` button.

You should now see your generated token.

![Screenshot 2025-09-01 at 9.43.23 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_43_23_AM_ee6129f481.png)

To transfer our data, we will use the Strapi CLI Transfer command. 

Ensure you are in your `backend` folder and run the following command to see all the helpful options.

``` bash
yarn strapi help transfer
```

You should see the following output. This will show all the options that are available to you.

``` bash
$ strapi help transfer
Usage: strapi transfer [options]

Transfer data from one source to another

Options:
  --from <sourceURL>                      URL of the remote Strapi instance to get data from
  --from-token <token>                    Transfer token for the remote Strapi source
  --to <destinationURL>                   URL of the remote Strapi instance to send data to
  --to-token <token>                      Transfer token for the remote Strapi destination
  --force                                 Automatically answer "yes" to all prompts, including
                                          potentially destructive requests, and run
                                          non-interactively.
  --exclude <comma-separated data types>  Exclude data using comma-separated types. Available types:
                                          content,files,config
  --only <command-separated data types>   Include only these types of data (plus schemas). Available
                                          types: content,files,config
  -h, --help                              display help for command
✨  Done in 2.16s.
➜  backend git:(main) 
```

To start the transfer, I will type the following in my terminal: You will need to use your URL and Token, which we just generated.

``` bash
yarn strapi transfer
```

You will see the following message, go ahead and sellect `Push local data to remote Strapi`.

``` bash
backend git:(main) yarn strapi transfer

yarn run v1.22.22
$ strapi transfer
ℹ️  Data transfer documentation: https://docs.strapi.io/dev-docs/data-management/transfer
ℹ️  No transfer configuration found in environment variables
   → Add STRAPI_TRANSFER_URL and STRAPI_TRANSFER_TOKEN environment variables to make the transfer process faster for future runs
? Choose transfer direction: 
  Pull data from remote Strapi to local 
❯ Push local data to remote Strapi 
```

This will lead you to the next step:

``` bash
? Choose transfer direction: Push local data to remote Strapi
? Enter the URL of the remote Strapi instance to send data to: 
```

Now enter your Srapi Cloud instance url.  In my case, it is `https://truthful-presence-e158445b54.strapiapp.com/admin` Notice I am including the `admin` portion of the url.

Then press enter, and it will prompt you for the token that we generated just a minute ago.

``` bash
? Please enter your transfer token for the remote Strapi destination [input is hidden]
```

![Screenshot 2025-09-01 at 9.43.23 AM.png](https://delicate-dawn-ac25646e6d.media.strapiapp.com/Screenshot_2025_09_01_at_9_43_23_AM_ee6129f481.png)

Paste it in and press `enter` to continue.

``` bash
? The transfer will delete existing data from the remote Strapi! 
Are you sure you want to proceed? (y/N) y
```

Confirm by typing `y` and press **Enter** to continue.

You should see a similar output.  

``` bash
Starting transfer...
┌─────────────────────────────────────────┬───────┬───────────────┐
│ Type                                    │ Count │ Size          │
├─────────────────────────────────────────┼───────┼───────────────┤
│ entities                                │    43 │      61.2 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::global.global                   │     2 │ (     1.6 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::home-page.home-page             │     2 │ (     2.1 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- api::summary.summary                 │    12 │ (    46.5 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::i18n.locale                  │     1 │ (     253 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.file                  │     2 │ (     3.5 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::upload.folder                │     1 │ (     269 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.permission │    19 │ (     5.3 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.role       │     2 │ (     658 B ) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- plugin::users-permissions.user       │     2 │ (       1 KB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ assets                                  │    10 │         4 MB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ -- .jpg                                 │    10 │ (       4 MB) │
├─────────────────────────────────────────┼───────┼───────────────┤
│ links                                   │    68 │      14.1 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ configuration                           │    36 │       112 KB  │
├─────────────────────────────────────────┼───────┼───────────────┤
│ Total                                   │   157 │       4.2 MB  │
└─────────────────────────────────────────┴───────┴───────────────┘
Transfer process has been completed successfully!
✨  Done in 373.13s.
```

Once you finish, go back into your Strapi Project, which we deployed in the cloud, hit refresh, and you should now see your data.

<video width="100%" height="auto" autoplay loop muted playsinline>
  <source src="https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_aritcles_checking_data_c171713b1d.mp4">
[09-article-deployed-project.mp4](https://delicate-dawn-ac25646e6d.media.strapiapp.com/09_article_deployed_project_3e083d0ce1.mp4)
  Your browser does not support the video tag.
</video>

Nice. We just seeded our initial data into our Cloud App.

In the next blog post, we will deploy our front end to **[Vercel](https://vercel.com/)** and connect both projects.

We are on our final stretch. See you in the next post.

### Note about this project

This project has been updated to use Next.js 15 and Strapi 5.

If you have any questions, feel free to stop by at our [Discord Community](https://discord.com/invite/strapi) for our daily "open office hours" from 12:30 PM CST to 1:30 PM CST.

Feel free to make PRs to fix any issues you find in the project, or let me know if you have any questions.

Happy coding!

Paul
