# Contextubot Contribution Guidelines

This document contains information of use to developers looking to
improve the Contextubot's codebase.  See [README.md](README.md) for an
introduction to this project.

## Submitting and Reviewing Code

This repository has a home on
[GitHub](https://github.com/badideafactory/contextubot).  Please submit
[pull requests](https://help.github.com/articles/about-pull-requests/)
(PRs) there.

Please submit changes via pull request, even if you have direct commit
access to the repository.  The PR process allows us to get additional
eyes on change proposals, and ensures that your changed code [builds
cleanly via Travis CI's automated Gradle
build](https://travis-ci.org/OpenTechStrategies/psm).  We have caught
issues at this stage in even simple patches.

As you work on your branch, try to test it locally to ensure that it
still builds and deploys properly.

Generally, the more controversial, complex or large a change, the more
opportunity people should have to comment on it.  That means it should
garner more comments/approvals, or it means it should sit longer
before being merged. You can talk with us about a change you'd like to
make before or while you work on it. We don't have hard rules about such things, and documentation changes usually don't need to sit as long as functional changes, but figure a business day or two for an average patch
to get discussed.

As to when to merge, if you aren't sure, just ask!

If your PR fixes a bug or adds a feature, please include a brief testing
plan along with the change.  Once a test framework has been set up, that
testing plan will come in the form of a test.

### The "Obvious Fix" rule: committing some minor changes directly to 'master'

Certain kinds of presumed-safe changes may be reviewed post-commit
instead of pre-commit, meaning that they can be committed directly to
`master` without going through a PR, when the committer has push
access to do so.

The purpose of this is to save time for busy developers.  It avoids
the low-but-still-noticeable overhead of the PR review process for
changes where the that process would not provide much additional
protection beyond what post-commit review provides anyway.  In
practice, that means the following kinds of changes:

* Clear typo fixes.

  If there's an obvious typo that doesn't affect code flow (e.g., a
  typo in a code comment, or even in a user-visible string), you can
  just fix it.  However, if the typo affects code behavior, other than
  in how user-visible text is displayed, then it should go through the
  normal PR review process.

* Whitespace and formatting cleanups.

  Commits that are formatting-only and make the code more compliant
  with our coding guidelines can just be committed directly.  There is
  no need to take a reviewer's time with them.

* Developer documentation changes.

  If the substance of a development documentation change is agreed on,
  and it's just a matter of wording, then the change can just be
  committed directly, since after all, it's easy to improve it later.
  (For example, the commit that added this section to this document
  would qualify.)

  Substantive changes to user-facing documentation should, of course,
  still go through the normal PR process.

Developers should always exercise judgement, of course.  It's always
okay to still use a PR for a change qualifies as an "obvious fix", and
if one thinks there is any chance of controversy or disagreement about
the change, then the best thing to do is put it into a PR so it can go
through the regular review process.

### Branching and Branch Names

We do all development on lightweight branches, with each branch
encapsulating one logical changeset (that is, one group of related
commits).  Please try to keep changesets small and well-bounded: a
branch should usually be short-lived, and should be turned into a PR,
reviewed, and merged to `master` as soon as possible.  Keeping
branches short-lived reduces the likelihood of conflicts when it comes
time to merge them back into master.

When a branch is associated with an issue ticket, then the branch name
should start with the issue number and then give a very brief summary,
with hyphens as the separator, e.g.:

    871-fix-provider-risk-score

Everything after the issue number is just a reminder what the branch
addresses.  Sometimes a branch may address only part of an issue, and
that's fine: different branches can start with the same issue number,
as long as the summary following the issue number indicates what part
of the issue that particular branch addresses.

If there is no issue number associated with a branch, then don't start
the branch name with a number.

While there are no strict rules on how to summarize a branch's purpose
in its name, it may help to keep in mind some common starting words:
"`fix`", "`feature`", "`refactor`", "`remove`", "`improve`", and "`test`".

### Rebases and force-pushes

Force pushes (after a rebase or a `commit --amend`) are currently
allowed everywhere except the master branch.  This repository has master
as a "protected" branch, meaning force-pushes are disabled
automatically.  If you're working with someone else on a shared branch
you should talk with them before changing shared history.  We expect
force-pushing to mostly occur in active PR branches.

### Commit Messages
Please adhere
to [these guidelines](https://chris.beams.io/posts/git-commit/) for
each commit message.  The "Seven Rules" described in that post are:

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain _what_ and _why_ vs. _how_

Think of the commit message as an introduction to the change.  A
reviewer will read the commit message right before reading the diff
itself, so the commit message's purpose is to put the reader in the
right frame of mind to understand the code change.

The reason for the short initial summary line is to support commands,
such as `git show-branch`, that list changes by showing just the first
line of each one's commit message.

### Indentation and Whitespace

((TBD))

### Licensing Your Contribution
The Contextubot is published under the terms of version 2 of the
[Apache Software License](http://www.apache.org/licenses/).  It is
important that the codebase continue to be publishable under that
license.  To make that possible, here are some guidelines on including
3rd party code in the codebase.

If you submit code that you wrote or that you have authority to submit
from your employer or institution, you give it to us under version 2
of the Apache Software License.  If the material you submit is already
licensed under a more permissive license (BSD, MIT, ISC), you can tell
us that and give it to us under that license instead.

Please make the license of the code clear in your pull request.  Tell
us who wrote it, if that isn't just you.  If the code was written for
an employer, tell us that too.  Tell us what license applies to the
code, especially if it differs from the project's Apache 2.0 license.

If you submit code that doesn't come from you or your employer, we
call that "Third-Party Code" and have a few requirements.  If the code
contains a license statement, that's great.  If not, please tell us
the license that applies to the code and provide links to whatever
resources you used to find that out. For some examples, see the
LICENSE and METADATA parts of [Google's guide to introducing
third-party
code](https://opensource.google.com/docs/thirdparty/documentation/#license).

If your submission doesn't include Third Party Code, but instead
depends on it in some other way, we might need a copy of that
software.  Your submission should tell us where and how to get it as
well as the license that applies to that code.  We will archive a copy
of that code if we accept your pull request.

### Expunge Branches Once They Are Merged

Once a branch has been merged to `master`, please delete the branch.
You can do this via the GitHub PR management interface (it offers a
button to delete the branch, once the PR has been merged), or if
necessary you can do it from the command line:

    # Make sure you're not on the branch you want to delete.
    $ git branch | grep '^\* '
    * master

    # No output from this == up-to-date, nothing to fetch.
    $ git fetch --dry-run

    # Delete the branch locally, if necessary.
    $ git branch -d some-now-fully-merged-branch

    # Delete it upstream.
    $ git push origin --delete some-now-fully-merged-branch

## Avoiding Generatable Elements In The Repo

As a general rule, we try to keep generated elements out of the
repository.  This includes files that result from build processes.  If
we want to memorialize a compiled version of the program, the best way
to do that is with tags or to record that information and put the
saved version somewhere other than this repository.  If a file can be
generated from the materials in the repository using
commonly-available tools, please do not put it in the repository
without raising it for discussion.

## Thank you!

The Contextubot will help fight misinformation by providing the bigger picture. We're glad to have your help getting there
faster.
