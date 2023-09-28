ARG FUNCTION_DIR="/function"
FROM node:12-buster@sha256:ce791f92b445f8968c6739fff3bb88c1eaf139513158e6be65a48087388648cb as build-image
ARG FUNCTION_DIR
ARG PANDOC_VERSION=2.19.2
ARG GITHUB_SHA_ARG
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev
RUN mkdir -p ${FUNCTION_DIR}
COPY . ${FUNCTION_DIR}
WORKDIR ${FUNCTION_DIR}
RUN wget https://github.com/jgm/pandoc/releases/download/$PANDOC_VERSION/pandoc-$PANDOC_VERSION-linux-amd64.tar.gz \
    && tar -xvzf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz --strip-components 1 -C /usr/local \
    && rm -rf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz
RUN npm install aws-lambda-ric 
RUN npm install
RUN npm start

FROM node:12-buster-slim@sha256:680bdb99eb94b7bf4329247557da66db03cf584bb6f273a8de823ff1b588c3b6
ARG FUNCTION_DIR
WORKDIR ${FUNCTION_DIR}

COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}
COPY --from=build-image /usr/local /usr/local

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]

CMD ["index.server"]