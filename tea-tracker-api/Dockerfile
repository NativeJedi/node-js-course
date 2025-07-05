FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build


FROM node:20-alpine AS runtime

WORKDIR /app

# Only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# For gracefull shuptdown signals
RUN apk add --no-cache tini

ENV NODE_ENV=production
ENV PORT=3000
ENV API_KEY='im_rd_student'

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/main.js"]
