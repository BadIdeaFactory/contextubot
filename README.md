# glorious-contextubot
*Lets make the "big picture" as interesting as the viral one.*

## installation instructions
* git clone https://github.com/BadIdeaFactory/contextubot.git develop
* yarn
* yarn start

Contextubot should start and open a browser tab at localhost:3000

## dependencies

We use graphical component library https://ant.design/

## notes

Watch out for LFS issues. When cloning and checking out branches, do something like this:

> GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/BadIdeaFactory/contextubot.git
> GIT_LFS_SKIP_SMUDGE=1 git checkout develop

https://github.com/git-lfs/git-lfs/issues/720
