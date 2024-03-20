FROM node:alpine
WORKDIR /app
ENV DB_HOST=
COPY package.json /app/
RUN npm install
COPY . .
EXPOSE 7005
CMD [ "node","index.js" ]