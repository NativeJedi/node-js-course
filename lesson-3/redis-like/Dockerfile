FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN npm install

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]
