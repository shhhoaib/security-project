# Node.js 20 use karo — better-sqlite3 ke liye zaroori
FROM node:20-alpine

# Python aur build tools install karo
RUN apk add --no-cache python3 make g++

# Root user mat use karo
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Working directory
WORKDIR /app

# Package files copy karo
COPY package*.json ./

# Dependencies install karo
RUN npm ci --only=production

# Baaki files copy karo
COPY . .

# Ownership do
RUN chown -R appuser:appgroup /app

# Non-root user
USER appuser

# Port
EXPOSE 3000

# Start
CMD ["node", "server.js"]
