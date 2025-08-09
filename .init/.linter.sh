#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-task-tracker-1169-1178/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

