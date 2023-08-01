# Use a lightweight Node.js image as the base image
FROM node:14-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container's working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code to the container's working directory
COPY src ./src
COPY public ./public
COPY tsconfig.json ./

# Build the React app
RUN npm run build

# Remove unnecessary node_modules (if needed)
RUN rm -rf node_modules

# Install serve globally
RUN npm i -g serve

# Set the command to start the server
CMD ["serve", "-s", "build"]
