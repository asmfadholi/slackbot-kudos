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

# build project
RUN yarn build

# Start the application
CMD yarn start