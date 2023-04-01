# Use Node 16 alpine as parent image
FROM node:14.19.1

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and yarn.lock to the /app directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of project files into this image
COPY . .

ENV SLACK_APP_TOKEN=$slack_app_token
ENV SLACK_SIGNIN_SECRET=$slack_signin_secret
ENV SLACK_APP_BOT_TOKEN=$slack_app_bot_token

# build project
RUN yarn build

# Expose application port
EXPOSE 3000

# Start the application
CMD yarn start