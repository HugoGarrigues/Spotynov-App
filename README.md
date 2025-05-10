# 🎵 SpotyNov API

API NestJS intégrant Spotify pour analyser les goûts musicaux des utilisateurs, permettre leur regroupement et calculer des statistiques personnalisées.

---

## 🚀 Fonctionnalités principales

- 🔐 **Authentification via Spotify OAuth2**
- 👤 **Récupération du profil utilisateur Spotify**
- 🎧 **Analyse des morceaux likés et des morceaux écoutés récemment**
- 📊 **Calcul de statistiques musicales** (popularité, durée moyenne…)
- 🧑‍🤝‍🧑 **Système de groupes entre utilisateurs**
- 📘 **Documentation Swagger intégrée**

---

## 🛠️ Technologies utilisées

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Swagger / OpenAPI](https://swagger.io/)
- [Passport](http://www.passportjs.org/)
- [Docker](https://www.docker.com/)
- [JWT](https://jwt.io/)

---

## 📂 Structure du projet

```bash
/spotynov-app
├── /backend
│   ├── /src
│   │   ├── /auth
│   │   ├── /groups
│   │   ├── /spotify
│   │   ├── /users
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── users.json
│   │   └── .env
├── /frontend
│   ├── /src
│   │   └── ...
├── docker-compose.yml
├── .dockerignore
└── README.md
```
---

## ⚙️ Installation & Lancement

### 📌 Prérequis
- **Node.js ≥ 18.**
- **Compte Spotify Developer**
- **Docker**

### 🔧 Installation
1. **Cloner le projet**
   ```sh
   git clone https://github.com/HugoGarrigues/Projet-Memory-Garrigues
   cd memory-app
   ```
2. **Créer un fichier `.env` dans le dossier `backend/src`**
   ```sh 
    SPOTIFY_CLIENT_ID=your_client_id
    SPOTIFY_CLIENT_SECRET=your_client_secret
    SPOTIFY_REDIRECT_URI=your_redirect_uri
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    ```
3. **Lancer le projet avec Docker**
    ```sh
    docker-compose up --build
    ```

4. **Accéder à l'application**
    - Backend : [http://localhost:3000](http://localhost:3000)
    - Frontend : [http://localhost:5173](http://localhost:5173)
    - Swagger : [http://localhost:3000/api](http://localhost:3000/api)
    

## 📘 Documentation Swagger

Une documentation complète est disponible à l'adresse :
[http://localhost:3000/api](http://localhost:3000/api)


## 👨‍💻  Auteurs

**GARRIGUES Hugo** - **IAFRATE Thomas** - **CRAYSTON Matt**
