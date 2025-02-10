<h1>How to Contribute to VRMS</h1>
<p>First off, thank you for taking the time to contribute! 🥳👍</p>

<p>This document outlines the process for joining our team and contributing to the VRMS Github repository. If you notice errors or have important information to add, please feel free to propose changes to this document with a pull request</p>

<h2>Table of Contents</h2>

- [**Part 1 : How to join the team**](#part-1--how-to-join-the-team)
  - [**1.1 VRMS contributor expectations**](#11-vrms-contributor-expectations)
  - [**1.2 Reach out to us on Slack**](#12-reach-out-to-us-on-slack)
  - [**1.3 Become a member of the repository Team**](#13-become-a-member-of-the-repository-team)
- [**Part 2: How to set up the development environment**](#part-2-how-to-set-up-the-development-environment)
  - [**2.1 Fork the repository**](#21-fork-the-repository)
  - [**2.2 Clone the remote repository to your local computer**](#22-clone-the-remote-repository-to-your-local-computer)
  - [**2.3 Get up and running**](#23-get-up-and-running)
  - [**2.4 Running Tests**](#24-running-tests)
  - [**2.5 Using the development database**](#25-using-the-development-database)
- [**Part 3: How to work on issues**](#part-3-how-to-work-on-issues)
  - [**3.1 Claim an Issue**](#31-claim-an-issue)
  - [**3.2 Create a new branch for each issue you work on**](#32-create-a-new-branch-for-each-issue-you-work-on)
  - [**3.3 Work on the Issue**](#33-work-on-the-issue)
- [**Part 4: How to create pull requests**](#part-4-how-to-create-pull-requests)
  - [**4.1 Push changes to your forked repository**](#41-push-changes-to-your-forked-repository)
  - [**4.2 Create a pull request on the VRMS repository**](#42-create-a-pull-request-on-the-vrms-repository)

## **Part 1 : How to join the team**

### **1.1 VRMS contributor expectations**

- Attend at least 1 team meeting per week
- Devote a minimum of 6 hours per week to working on VRMS assignments
- Communicate with the team leadership if you plan to step away from the project

### **1.2 Reach out to us on Slack**

If you would like to contribute to our project, please reach out to the team leads on Slack or at one of our weekly meetings. You can find the current project team, their slack links, and our team meeting times on the [VRMS Project Details Page](https://www.hackforla.org/projects/vrms).

### **1.3 Become a member of the repository Team**

Send your GitHub name to the project manager, or post it in the [VRMS Slack channel](https://hackforla.slack.com/archives/CRGH5HM0Q), and we'll add you as a member to the GitHub repository Team. Note: you should be added to both the VRMS and VRMS-write teams.

Once you have accepted the GitHub invite (via email or in your GitHub notifications), please do the following:

1. Mark your own membership public https://help.github.com/en/articles/publicizing-or-hiding-organization-membership#changing-the-visibility-of-your-organization-membership

1. Setup two factor authentication on your account https://github.com/hackforla/governance/issues/20

These steps are manditory in order to contribute to all HackforLA projects.

## **Part 2: How to set up the development environment**

### **2.1 Fork the repository**

_A fork is a copy of the repository that will be placed on your GitHub account url._

- In https://github.com/hackforla/VRMS, look for the fork icon in the top right. Click it and create a fork of the repository.

- It should create a copy here: https://github.com/YOUR_GITHUB_USERNAME/vrms, where `YOUR_GITHUB_USERNAME` is replaced with your github username.

> NOTE: This copy is on a remote server on the GitHub website and not on your computer yet.

- Click the icon again, it will give you the URL associated with your forked repository and not create a new fork.

### **2.2 Clone the remote repository to your local computer**

The following process will make a copy of the fork that you just created on your local computer.

1. Create a new folder on your local computer that will contain `hackforla` projects.

2. In your shell (terminal), navigate to this folder then run the following commands:

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/vrms.git
   ```

   You should now have a new folder in your `hackforla` folder called `vrms`.

3. Verify which URL your `origin` remote is pointing to:

   ```bash
   git remote show origin
   ```

   Your terminal should return:

   ```bash
   remote origin
   Fetch URL: https://github.com/YOUR_GITHUB_USERNAME/vrms.git
   Push URL: https://github.com/YOUR_GITHUB_USERNAME/vrms.git
   ...
   ```

   If you accidentally cloned the `hackforla/vrms.git` then you can change your local copy to upload to your fork with the following:

   ```bash
   git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/vrms.git
   ```

4. Add another remote called `vrms` that points to the `hackforla` version of the repository. This will allow you to incorporate changes later:
   ```bash
   git remote add vrms https://github.com/hackforla/vrms.git
   ```

Note: Understanding how git remotes work will make collaborating much easier. You can learn more about remotes [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork) and [here](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes).

### **2.3 Get up and running**

1. Have [Node](https://nodejs.org/en/download/) and NPM installed locally:

   - Verify with `node -v` and `npm -v` respectively.

1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable): an improved package manager

   - Verify with `yarn --version`

1. Verify that you have the git remote repositories configured:

   - Verify that the output of `git remote -v` shows your local repo as origin and the upstream vrms repo.

1. Install the node packages needed in each directory:

   - `cd vrms/` and run `yarn install`
   - `cd client` and run `yarn install`
   - `cd ../backend` and run `yarn install`

1. Add your required environment variables for the frontend and backend directories:

   - `touch vrms/backend/.env`
   - `touch vrms/client/.env`

   Note 1: In the above example you are trying to create an empty file called `.env` in each of the listed directories: backend and client. You can use either `touch <path-to-directory> .env` or navigate to the directory and use `touch .env`

   Note 2: `touch` is a Unix/Linux or Mac command; It is not available in Windows. In Windows, use a text editor (e.g. Notepad) to create an empty file and save it in each of the locations as `.env` . (If you use Windows Explorer to create the file it will create a file called `.env.txt`, which will not work.)

   - Then paste the content from the [document](https://docs.google.com/document/d/1PdcZhyo2a2lr0JNcgyzpWi98tGkZeH1Zxz-Jnf6JQDU/edit?usp=sharing). It is accessible for the project team members only.

   - _Please note that the `ports` for the frontend and backend are set in this location_

1. Take a second to review the `app.js` and `server.js` files in the `vrms/backend` folder. These two files are a blueprint for the back end, so please familiarize yourself with it. You'll see folders for the database collection models, routes for the API, and a config file which loads the necessary environment variables.

1. Start the local development servers (frontend & backend).

   To run `client`:

   - Navigate to the root of the application `vrms/` and run `yarn start`

   _Troubleshooting :_ If you encounter the following error after running `yarn start`:

   ```
   Error: error:0308010C:digital envelope routines::unsupported
   ```

   Try changing your node version to `16.14.2` by running `nvm use 16.14.2`. If you do not have `nvm` installed, see [install instructions](https://github.com/nvm-sh/nvm#installing-and-updating)

You should now have a live app. Happy hacking.

### **2.4 Running Tests**

The VRMS application has a variety of tests written for the application. Review the `package.json` file in any directory
and look for any variation of `test` scripts.

To run all of the tests run `npm run test:all` from the root folder.

### **2.5 Using the development database**

The application uses MongoDB. We have created a shared development database using MongoDB Cloud and MongoDB Atlas. The conection string for the development database is included in the environmental variables that you pasted into your backend/.env file in step 5 of the "Get Up and Running" setion. If you completed that step successfully you should not need to do anything else.

To view and edit the development database manually, you can download [MongoDB Compass](https://www.mongodb.com/try/download/compass). To connect to the development database you will use the "DATABASE_URL" from the [document](https://docs.google.com/document/d/1yDF6UmyO-MPNrl3y_Mw0mkm_WaixlSkXzWbudCzHXDY/edit?usp=sharing) that contained the environmental variables. The string will start with "mongodb+srv://".

If you want to install a local copy to experiment with and learn more about MongoDB, you can use [this tutorial](https://zellwk.com/blog/local-mongodb/)

## **Part 3: How to work on issues**

### **3.1 Claim an Issue**

Developers may assign themselves to issues from the [Prioritized Backlog column](https://github.com/orgs/hackforla/projects/72/views/1?filterQuery=backlog) of the project board.

The Prioritized Backlog column is filtered so the first (top) issue has the highest priority and should be worked on next if possible.

Developers may choose from issues with the following `role` labels:

- `role: Front End`
- `role: Back End`
- `role: Database`

Claiming an issue is a two step process:

1. Assign yourself to the issue using the gear icon in the upper right corner of the issue where it says "Assignees"
2. Move the issue from the `Prioritized Backlog` to the `In Progress` column of the project board

You may want to consider bookmarking your Github Issues page to track your current tasks:
[https://github.com/issues/assigned](https://github.com/issues/assigned)

### **3.2 Create a new branch for each issue you work on**

You will create a new branch for each issue you work on. Doing all your work on feature branches leaves your repository's main branch unmodified and greatly simplifies keeping your fork in sync with the main project.

1. Before creating a new branch, always make sure you are currently on the `development` branch by using the command
   ```bash
   git branch
   ```
2. Before creating a new branch, always pull down the latest changes from the `development` branch by using the command
   ```bash
   git pull vrms development
   ```
3. Finally, create a new branch where you will work on your issue by using the command:
   ```bash
   git checkout -b your-branch-name
   ```

### **3.3 Work on the Issue**

Every issue will contain action items you must complete before you are ready to submit a pull request. Be sure to use the checkboxes as you complete each action item so we can track your progress!

After you have completed the action items, add and commit the changes to your new branch using the commands

```
git add .
git commit -m "your commit message"
```

## **Part 4: How to create pull requests**

### **4.1 Push changes to your forked repository**

1. Before pushing code, always pull down the latest changes from the `development` branch by using the command
   ```
   git pull vrms development
   ```
2. Once you are satisfied with your changes, push them to the feature branch you made within your remote repository.
   ```
   git push --set-upstream origin your-branch-name
   ```

### **4.2 Create a pull request on the VRMS repository**

1. Go to your fork of the VRMS repository on GitHub and click on the `Compare & pull request` button. <details><summary>See screenshot</summary> <img src="https://user-images.githubusercontent.com/73561520/220488394-09bc759e-98d9-4a09-86c6-66378cf50923.png"/></details>
2. Be sure to title your pull request by summarizing the changes you made
3. Be sure to add your issue number where the template says `Fixes #replace_this_text_with_the_issue_number`
4. Fill out the "What changes did you make and why?" section of the pull request template
5. Include before & after images with your pull request if there are visual changes to the user interface
6. Request a review from another developer on the team
7. Review another developers pull request while you are waiting for your pull request to be reviewed
