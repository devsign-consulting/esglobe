FROM node:9.8.0

RUN apt-get update \
 && mkdir -p /usr/src/app

WORKDIR /usr/src/app
EXPOSE 8080

# Copy the package.json and npm-shrinkwrap.json. We need them for installing npm modules.
COPY package.json /usr/src/app/

# Install the production node modules.
RUN npm install --production

COPY server /usr/src/app/

CMD ["npm", "start"]


