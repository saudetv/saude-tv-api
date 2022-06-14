FROM node:16
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

COPY .env.production ./.env

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
