FROM node:14.15.4-alpine3.10 as client_builder

ARG REACT_APP_API_URL
ARG REACT_APP_GYAZO_AUTH_URL
ARG REACT_APP_GA_UNIVERSAL_ID

WORKDIR /client
COPY ./client/package*.json .
RUN yarn install

ADD ./client .
RUN yarn build

FROM rust:1.49
WORKDIR /server
ADD ./server .
RUN cargo install --path .
RUN ls | grep -v -E 'templates' | xargs rm -r
COPY --from=client_builder /client/build ./build
RUN mkdir tmp

CMD ["bloggimg-server"]