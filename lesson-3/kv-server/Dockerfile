FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY config ./config

FROM nativejedi/lite-node AS runtime

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json ./

EXPOSE 3001

ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","src/index.js"]
