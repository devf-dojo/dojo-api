#!/bin/bash

cd functions
npm install -g firebase-tools
npm install
npm update

echo $ARGUMENTS['JSON'] >> serviceAccountKey.json

firebase deploy --token $ARGUMENTS['token']