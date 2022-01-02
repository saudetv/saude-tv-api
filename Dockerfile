FROM node:12

WORKDIR /node-app

COPY package.json .

RUN yarn install

RUN npm install -g nodemon

COPY . . 

EXPOSE 3000

CMD yarn dev