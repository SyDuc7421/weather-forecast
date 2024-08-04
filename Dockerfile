FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

FROM node:20-alpine

# Set the working directory
WORKDIR /app

COPY --from=builder /app/build ./build

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./

COPY --from=builder /app/.env .env

COPY --from=builder /app/config ./config

EXPOSE 8080

# Command to run the application
CMD ["node", "build/src/app.js"]
