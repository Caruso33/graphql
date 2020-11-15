FROM node:alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY ./src .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
