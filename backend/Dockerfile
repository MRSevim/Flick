# Development stage
FROM node:18-bookworm-slim as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-bookworm-slim as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD ["npm", "run" ,"start"]