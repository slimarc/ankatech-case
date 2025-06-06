FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN apk add --no-cache netcat-openbsd

CMD sh -c "until nc -z db 3306; do echo 'Waiting for DB to be ready...'; sleep 1; done && npx prisma migrate deploy && node dist/server.js"