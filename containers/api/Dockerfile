FROM node:18-alpine

WORKDIR /app

# Install Docker CLI
RUN apk update && apk add docker

# Copy package files
COPY src/package*.json ./

# Install project dependencies AND install 'tsx' globally
RUN npm install && npm install -g tsx

# Copy the source code
COPY src ./src

EXPOSE 3000

# Use tsx instead of node --loader ts-node
CMD ["tsx", "src/index.ts"]