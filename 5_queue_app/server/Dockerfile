FROM node:12.14.1-slim
RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install -g @prisma/cli --unsafe-perm

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ARG POSTGRES_USER
ENV POSTGRES_USER "$POSTGRES_USER"

ARG POSTGRES_PASSWORD
ENV POSTGRES_PASSWORD "$POSTGRES_PASSWORD"

RUN npm install
RUN prisma generate

CMD ["npm", "start" ]