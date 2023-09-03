FROM node:18 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install -g npm@10.0.0
RUN npm install
COPY . /app
RUN npm run build

#FROM nginx:latest
#COPY --from=build /app/public /usr/share/nginx/html
#COPY ./front.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

#COPY ./app/ ./
EXPOSE 5000
ENV HOST=0.0.0.0
CMD [ "npm","run","dev","--","--host"]