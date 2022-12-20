FROM node:16

LABEL authors="Jun9 Lee <lee.jun9@kt.com>"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm install

ENV NODE_ENV development

EXPOSE 3000

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
