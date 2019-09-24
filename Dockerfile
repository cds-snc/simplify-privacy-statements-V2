FROM pandoc/core
LABEL maintainer="-"

RUN apk add --update nodejs nodejs-npm

ARG GITHUB_SHA_ARG

COPY . /src

WORKDIR /src

RUN npm install --quiet --production

EXPOSE 3000

CMD [ "npm", "start" ]
ENTRYPOINT [ "npm", "start" ]