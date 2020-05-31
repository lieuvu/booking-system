FROM node:12.16.3-alpine3.11

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
COPY tsconfig.json /app/

# Run npm commands
RUN npm install
