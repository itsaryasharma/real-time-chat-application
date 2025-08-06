#!/usr/bin/env bash

# Install server dependencies
npm install

# Move to client folder
cd client

# Install frontend dependencies
npm install

# Build frontend
npm run build
