# Use Node 16 alpine as parent image
FROM node:14.19.1

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of project files into this image
COPY . .

# generate env
RUN yarn generate-env

# build project
RUN yarn build

# Expose application port
EXPOSE 3000

# Start the application
CMD yarn start