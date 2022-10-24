#!/bin/bash
# get cmd line arg default to learndev-container if none
CONTAINER_NAME=${1:-learndev-container}

# stop and remove old container
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
docker build -t learndev .
docker run -d --name $CONTAINER_NAME -p 5020:5020 learndev
