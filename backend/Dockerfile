FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]
