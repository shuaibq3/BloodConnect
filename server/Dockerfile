FROM node:22-bookworm-slim

WORKDIR /app

# Copy the common directory as it's needed for the server
COPY common ./common
# Copy the server directory
COPY server ./server

WORKDIR /app/server

RUN npm install

# Build the server (assuming it has a build script)
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
