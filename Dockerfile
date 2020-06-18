FROM node:14-alpine3.12

# Update image
RUN apk update
RUN apk upgrade

# Install bash
RUN apk add --no-cache bash

# Set working directory
RUN mkdir /app
WORKDIR /app

# Copy source files
COPY package.json /app/

# Run npm commands
RUN npm install
