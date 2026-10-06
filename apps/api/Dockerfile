# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 5000

# CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /app

# Copy root files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma/
COPY apps/api/tsconfig.json ./apps/api/

# Install dependencies
WORKDIR /app/apps/api
RUN npm install

# Copy source
COPY apps/api/src ./src

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 5001

CMD npx prisma db push && npm start