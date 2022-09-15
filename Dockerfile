FROM --platform=linux/amd64 node:16.13.0

ENV MONGGOOSE_URI="mongodb+srv://hoainam:hoainam07@backend.pup32.mongodb.net/DSV_intern"
ENV JWT_SECRET="dsv_intern"
ENV PORT=80

WORKDIR /app
COPY package*.json ./
 
 
RUN npm install npm@8.5.3 -g
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install

COPY . .

CMD ["npm","start"]