FROM node:18-alpine

WORKDIR /app


RUN apk update && apk add docker


COPY src/package*.json ./


RUN npm install && npm install -g tsx


COPY src ./src

EXPOSE 3000


CMD ["tsx", "src/index.ts"]