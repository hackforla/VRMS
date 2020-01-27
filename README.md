# Volunteer Relationship Management System

VRMS is a tool used for the engagement, support, and retention of a network of volunteers.

This is an ambitious project to create a system that will help us measure our human capital development, reduce repetitive tasks and processes for leadership, and improve outcomes for both volunteers and the projects they contribute to.

### Project Context

We are currently in the initial planning phase after delivering a prototype to the organization's leadership. Our priorities are laying out a feature roadmap for beta and beyond, and recruiting a team of dedicated members to build the product. Time is of the essence, as each Hack Night is a new opportunity to garner valuable data which, in return, supports the organization and it's members. 

### Technologies

This is a Full Stack web app, built with:
- [React](https://reactjs.org/docs/getting-started.html)
- Node/[Express](https://expressjs.com/en/starter/installing.html)
- [MongoDB](https://docs.mongodb.com/manual/tutorial/getting-started/)
- [Heroku](https://devcenter.heroku.com/categories/reference)

## How to contribute

Head over to the [wiki](https://github.com/hackforla/VRMS/wiki).

You'll find all the product documentation, and if this seems like a project you'd like to dedicate your time to, reach out to the leads on Slack or at one of our weekly Hack Nights.

## Using Git (If you're familiar with forking and pulling/pushing/committing, head to the next section)

This section discusses some tips and best practices for working with Git.

### Making changes, committing and pushing

1. Changes start on your local fork of this repository, in your own branch.

1. Commit your changes with a comment related to the issue it addresses to your local repository.

1. Push that commit(s) to GitHub.

1. From the `VRMS` repository, create a Pull Request which asks `VRMS` to pull changes from your fork into the main repository.

1. After the owner of the `VRMS` repository approves and merges your Pull Request, your changes will be live on the website. 

### Forking and cloning the repository with proper security

#### Step 1: Become a member of the repository Team

In the `vrms` slack channel, send your GitHub name to the project manager (or on the slack channel thread) and we'll add you as a member to the GitHub repository Team.

Once you have accepted the GitHub invite (via email or in your GitHub notifications), please do the following:

1. Mark your own membership public https://help.github.com/en/articles/publicizing-or-hiding-organization-membership#changing-the-visibility-of-your-organization-membership

1. Setup two factor authentication on your account https://github.com/hackforla/governance/issues/20

These steps are manditory in order to contribute to all HackforLA projects. 

#### Step 2: Fork the repository

In https://github.com/hackforla/VRMS, look for the fork icon in the top right. Click it and create a fork of the repository.

For git beginners, a fork is a copy of the repository that will be placed on your GitHub account url.

It should create a copy here: https://github.com/your_GitHub_user_name/vrms, where `your_GitHub_user_name` is replaced with exactly that.

Note that this copy is on a remote server on the GitHub website and not on your computer yet.

If you click the icon again, it will not create a new fork but instead give you the URL associated with your fork.

#### Step 3: Clone your online repository to your local computer

For git beginners, this process will create a third copy of the repository on your local desktop.

First create a new folder on your desktop that will contain `hackforla` projects.

In your shell, navigate there then run the following commands:

```bash
git clone https://github.com/your_GitHub_user_name/vrms.git
```

You should now have a new folder in your `hackforla` folder called `vrms`.

Verify which URL your `origin` remote is pointing to:

```bash
git remote show origin
```

If you accidentally cloned the `hackforla/vrms.git` then you can change your local copy to upload to your fork with the following:

```bash
git remote set-url origin https://github.com/your_user_name/vrms.git
```

Add another remote called `vrms` that points to the `hackforla` version of the repository. This will allow you to incorporate changes later:

```bash
git remote add vrms https://github.com/hackforla/vrms.git
```

#### Step 4: Change to a new branch

For each issue, create a new branch to work in.

This command will let you know available branches and which branch you're on.

Star (`*`) indicates which branch you're on

```bash
git branch
```

By default you should start on the `master` branch.

This command will (create and) change to a new branch:

```bash
git checkout -b 140-fix-logo-width
```

We prefer that you work on a branch name that relates to the issue you're working on.

The format should look like the scheme above where `140` is the issue number in GitHub, and the words are a brief description of the issue.

No law of physics will break if you don't adhere to this scheme but laws of git will break if you add spaces in the branch name. 

### Incorporating changes from upstream

Your fork of this repository on GitHub, and your local clone of that fork, will
get out of sync with this (upstream) repository from time to time.

Assuming you have a local clone with remotes `vrms` (this repo) and `origin`
(your GitHub fork of this repo):

```bash
# WARNING: this will erase local pending changes!
# commit them to a different branch or use git stash
git checkout master
git fetch vrms
git reset --hard vrms/master
```

## Get up and running

Do you have (Node)[https://nodejs.org/en/download/] and NPM installed?

Verify with `node -v` and `npm -v` respectively.

If you completed the Git steps above, you should be ready with your local fork loaded in your code editor of choice. Check your remotes again with `git remote -v` to make sure you're good to go. 

From the app root `vrms/`, we `npm install` to setup the `package.json` for the Node server, then `cd client/` and `npm install` again to setup the `package.json` for the React front end. This might take a minute or two. 

`cd ..` back to the app root.

Take a second to review the `server.js` file here. It is a blueprint for the back end, so please familiarize yourself with it. You'll see folders for the database collection models, routes for the API, and a config file which loads the necessary environment variables. 

Now, back to the command line:

`touch .env` to create a file for your environment variables.

Copy/paste the following inside:

```API_HOST=http://localhost:4000
APP_SERVER_PORT=4000
REACT_APP_PORT=3000
DATABASE_URL=mongodb+srv://testuser2:Riy4gVoo3RYzLJEB@cluster0-haogu.mongodb.net/testdb?retryWrites=true&w=majority
```

`touch .gitignore` (if not included) 

Copy/paste again so it looks like this:

```/node_modules
npm-debug.log
.DS_Store
/*.env
```

`pwd` and make sure you're in the app root. 

`nodemon` (if installed, or `npm start`)

`cd client/`

`npm start` again

You should now have a live app. Happy hacking.


### Licensing *WIP*

Details about the project's open source status below: 
