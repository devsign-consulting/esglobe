FROM node:9.8.0

RUN apt-get update \
 && mkdir -p /usr/src/app

WORKDIR /usr/src/app
EXPOSE 8080

# Copy the package.json and npm-shrinkwrap.json. We need them for installing npm modules.
COPY package.json /usr/src/app/

# Install the production node modules.
RUN npm install --production

COPY server /usr/src/app/server
COPY esglobe_modules /usr/src/app/esglobe_modules
COPY sph_plugins /usr/src/app/sph_plugins
COPY user_modules /usr/src/app/user_modules

CMD ["node", "./server/bin/www"]


