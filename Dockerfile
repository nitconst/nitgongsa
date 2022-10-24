FROM node:18

LABEL authors="Jun9 Lee <lee.jun9@kt.com>"

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm install

ENV NODE_ENV development

EXPOSE 5001

CMD [ "npm", "start" ]
