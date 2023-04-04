FROM node:16
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

COPY .env.production ./.env

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
