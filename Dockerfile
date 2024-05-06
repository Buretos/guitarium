FROM node:18

WORKDIR /user/src/app

COPY . .

WORKDIR /user/src/app/frontend
RUN npm i
RUN npm run build

WORKDIR /user/src/app/backend
RUN npm i
RUN npm rebuild bcrypt

EXPOSE 3001

CMD ["node", "app.js"]

