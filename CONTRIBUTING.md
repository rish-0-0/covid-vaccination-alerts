# Contributing to us

## Create a FORK on GitHub
- It's the button next to the star button
- By doing this, you'll get a copy of the repo in your account

## Add an upstream remote
- You need to add an extra remote so you can receive updates from this repo
- `git remote add upstream https://github.com/rish-0-0/covid-vaccination-alerts.git`
- `git remote -v` will show all the remotes in your repo. Your forked repo should have two
- - One `origin` for your Forked version
- - One `upstream` which points to my repo

## Fetch updates from my repo
- `git fetch upstream`

## Fetch updates from all repos
- `git fetch --all`

## Merge updates from my repo to your branch
- `git pull upstream <branch>`

## Rebase updates from my repo to your branch
- `git pull upstream <branch> --rebase`

## Making a new pull request
- Please provide a list of all changes done
- Few automated tests would be really helpful
- Please make a description to the `PR`
- Each commit should have a list of files changed
- - For this to work, you shouldn't do `git commit -m` instead use `git commit`
- - `git commit` gives you the option to uncomment all the file changes that ocurred and also write a long commit message
- Ask for review from `@rish-0-0`
- Label the PR as either a `bug fix`, `hotfix`, `new-feature` on GitHub
- Thank you for your contribution