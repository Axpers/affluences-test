FROM node:16

WORKDIR /app
COPY . /app

RUN apt-get install python

RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

RUN pnpm install

CMD nest start --watch