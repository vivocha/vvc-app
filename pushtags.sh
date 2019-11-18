#!/bin/bash

TAG=`git --no-pager tag --points-at | grep '@vivocha/client-interaction@'`
VER=`echo $TAG | sed "s/\@vivocha\/client\-interaction\@//g"`

if [ -z "$TAG" ]
then
  echo "no tag to push"
else
  echo "pushing tag: $VER to app repo"
  TMP_BRANCH=app_br_$VER
  TMP_TAG=app_tag_$VER
  # https://stackoverflow.com/questions/17911466/how-to-push-tags-with-git-subtree
  # Checkout the tag
  git checkout $TAG
  # Create a branch containing only app for this tag
  git subtree split --prefix=interaction/app/default -b $TMP_BRANCH
  # Create the tag on this branch
  git checkout $TMP_BRANCH
  git tag -a $TMP_TAG -m "$VER"
  # Push the tag on the app repository
  git push app $TMP_TAG:v$VER
  # Clean the Master repository
  # Clean the branch
  git checkout master
  git branch -D $TMP_BRANCH
  git tag -d $TMP_TAG
  git gc --prune=now
fi