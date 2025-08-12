FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY build.js ./build.js

ENV NODE_ENV=production
ENV PORT=3000

RUN npm run build

FROM nativejedi/lite-node AS runtime

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000

ENTRYPOINT ["/sbin/tini","--"]
CMD ["node","dist/server.js"]
