# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

EXPOSE 80

# Define environment variable
ENV PORT 80

# Run the app when the container launches
CMD ["node", "app.js"]