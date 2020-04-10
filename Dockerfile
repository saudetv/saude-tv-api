FROM node:12

WORKDIR /node-app

COPY package.json .

RUN yarn install

COPY . . 

EXPOSE 3000

CMD yarn dev