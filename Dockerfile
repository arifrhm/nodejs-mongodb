# Use an official Node.js runtime as a parent image
FROM node:14-alpine

RUN apk update &&\ 
    apk add --no-cache\
    make gcc g++ python3

ENV PYTHON /usr/bin/python3
ENV PYTHONPATH /usr/lib/python3
ENV PYTHON_CONFIGURE_OPTS="--enable-shared"

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application dev mode
CMD ["npx", "nodemon", "app.js"]