#!/bin/bash -e

echo 'script'

org=$1
oldName=$2
newName=$3

git status

git checkout -b lens-rename

git add .
git rm $oldName.html
git rm $oldName.css
git rm test/$oldName.html

git commit . -m 'renaming'

git push origin lens-rename