# syntax=docker/dockerfile:1
FROM node:16.8.0
RUN npm install forever -g
WORKDIR /
COPY . .
RUN npm install --production
CMD ["forever", "./server.js"]