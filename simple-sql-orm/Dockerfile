# Dockerfile.dev ─ образ лише для локальної розробки
FROM node:20-alpine

WORKDIR /app

# 1 · Встановлюємо тільки залежності, щоби кеш не ламався після кожногоsave
COPY package*.json ./
RUN npm install          # dev + prod deps

# 2 · Код підтягнеться через bind-mount, тому COPY не потрібен
#    (але лишаємо CMD, що стартує Nest у watch-режимі)
CMD ["npm", "run", "start"]

EXPOSE 3000
