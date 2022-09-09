FROM node:12.22.12-alpine
LABEL maintainer="-"

ARG GITHUB_SHA_ARG
ARG PANDOC_VERSION=2.19.2

COPY . /src

WORKDIR /src

# Install pandoc
RUN wget https://github.com/jgm/pandoc/releases/download/$PANDOC_VERSION/pandoc-$PANDOC_VERSION-linux-amd64.tar.gz \
    && tar -xvzf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz --strip-components 1 -C /usr/local \
    && rm -rf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz

# Install node deps
RUN npm install --quiet --production

EXPOSE 3000

# heroku needs this
CMD [ "npm", "start" ]

ENTRYPOINT [ "npm", "start" ]