FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon  # Installe nodemon globalement

CMD ["npm", "run", "start:dev"]  # Lancer le script de développement avec nodemon
