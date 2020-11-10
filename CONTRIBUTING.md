## How to contribute

If you are interested in joining the project, then please review our [Prroject Wiki](https://github.com/hackforla/VRMS/wiki/Join-the-Team) and then review our [Project Board](https://github.com/hackforla/VRMS/projects/2) to see if anything interests you.

### Committing changes overview

1. Find a ticket in the [Prioritized Backlog](https://github.com/hackforla/VRMS/projects/2) and assign yourself to the ticket, and update its status as "In progress".

1. Fork the repo.

1. Make a branch based on the `development` branch.

1. Develop the task solution.

1. Commit and push your changes to your forked repository. Please pull the recent changes from `vrms/development` before pushing your changes.

1. From the `VRMS` repository, create a Pull Request from your branch into the VRMS `developnent` branch.

1. Any changes will need approval and merging from a tech lead.

1. Bring an update of your changes to the weekly VRMS team checkin.

### Forking and cloning the repository

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

By default you should start on the `develop` branch.

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
