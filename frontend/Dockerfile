# Étape 1 : build
FROM node:18-alpine AS builder

WORKDIR /app

# Copie les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application (si nécessaire, sinon tu peux sauter cette étape si tu n'as pas de build)
RUN npm run build

# Étape 2 : Serveur de production avec Node.js
FROM node:18-alpine

WORKDIR /app

# Copie du code source et des dépendances
COPY --from=builder /app /app

# Expose le port que ton backend NestJS écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start:prod"]
