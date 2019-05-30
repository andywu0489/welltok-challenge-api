#!/bin/bash

API="http://localhost:4741"
URL_PATH="/articles"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "article": {
      "title": "'"${TITLE}"'",
      "description": "'"${DESCRIPTION}"'",
      "author": "'"${AUTHOR}"'",
      "tags": "'"${TAGS}"'"
    }
  }'

echo
