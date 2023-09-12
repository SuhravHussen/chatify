# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy your entire Express.js app into the container
COPY . .

# Build your app (modify this if needed)
RUN yarn build


RUN npm i -g prisma
RUN prisma generate

# Define the command to start your Express.js app
CMD [ "yarn", "start" ]
