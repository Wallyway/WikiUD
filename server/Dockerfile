# Use the official Node.js image as the base image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Add environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies https://docs.npmjs.com/cli/v11/commands/npm-ci
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]