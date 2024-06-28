#!/bin/bash
cd frontend

concurrently "cd ../backend && node index.js" "npm start"
