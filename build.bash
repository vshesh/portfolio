#!/bin/bash 

set -e 

fswatch client/* | while read -r line; do 
  bun build client/index.ts > web/index.js  || true 
  bun build client/fixtures/index.ts > web/storybook.js  || true 
  echo $line
done 