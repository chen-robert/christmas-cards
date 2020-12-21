FROM node:latest

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN yarn install --prod --frozen-lockfile && yarn cache clean

COPY . .

ENV NODE_ENV production

USER node

CMD ["node", "index.js"]
