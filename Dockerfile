FROM node:14.15.5

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install depedencies
COPY package.json /usr/src/app
RUN npm install

# Bundle app src
COPY . /usr/src/app

CMD [ "npm" , "start" ]
