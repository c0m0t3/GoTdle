FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz && \
    tar -xvzf dockerize-linux-amd64-v0.6.1.tar.gz && \
    mv dockerize /usr/local/bin

COPY . .

EXPOSE 3000

CMD ["npm", "run", "build"]
