#!/bin/bash

exit 0

echo 'Check for tag on commit. If there is no tag, we will abort the build'
git describe --exact-match --tags HEAD
RES=$?
if [ "$RES" = 0 ]; then
  exit 1
else
  exit 0
fi

