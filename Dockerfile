FROM node:12.22.12-alpine as build
LABEL maintainer="-"
ARG GITHUB_SHA_ARG
ARG PANDOC_VERSION=2.19.2
WORKDIR /app
COPY . .
RUN wget https://github.com/jgm/pandoc/releases/download/$PANDOC_VERSION/pandoc-$PANDOC_VERSION-linux-amd64.tar.gz \
    && tar -xvzf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz --strip-components 1 -C /usr/local \
    && rm -rf pandoc-$PANDOC_VERSION-linux-amd64.tar.gz
RUN npm install --quiet --production

FROM public.ecr.aws/lambda/nodejs:14

COPY --from=build /app .
RUN npm install --quiet --production
CMD [ "app.server" ]