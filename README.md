
# Music Micro Frontend

This project demonstrates a **micro frontend architecture** built with Vite, React, and Module Federation.  
It also includes **role-based authentication** for Admin and User access.

---

## Project Structure

```

music-micro-frontend/
├── main-app/        # Host shell (auth + routing)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── music-library/   # Micro frontend (remote)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md

````

---

## Run Locally

Clone the repo:

```bash
git clone https://github.com/02Ravi/music_app.git
cd music-micro-frontend
````

### 1. Start the Micro Frontend (Music Library)

The library must be built and served before starting the main app.

```bash
cd music-library
npm install
npm run build
npm run preview -- --port 3001 --strictPort
```

* Runs on: [http://localhost:3001](http://localhost:3001)
* Exposes: `dist/assets/remoteEntry.js`

---

### 2. Start the Main App

Once the music library is running:

```bash
cd ../main-app
npm install
npm run dev
```

* Runs on: [http://localhost:3000](http://localhost:3000) 
* Dynamically loads the micro frontend from **localhost:3001**

---

## Deployment (Vercel)

Both apps are deployed independently.

### Music Library

* Root folder: `music-library/`
* Framework preset: **Vite**
* Build command: `npm run build`
* Output directory: `dist`
* Deployed at: `https://music-app-murex-delta.vercel.app`

### Main App

* Root folder: `main-app/`
* Framework preset: **Vite**
* Build command: `npm run build`
* Output directory: `dist`
* Must reference the deployed Music Library URL.

Set this in `main-app/.env.production`:

```env
MUSIC_LIBRARY_URL=https://music-app-murex-delta.vercel.app/assets/remoteEntry.js
```

---

## Demo Credentials

**Admin**

* Username: `admin`
* Password: `admin123`

**User**

* Username: `user`
* Password: `user123`

---

## How It Works

### Micro Frontend

* `music-library` is a standalone app that builds to `remoteEntry.js`.
* The `main-app` dynamically loads this file at runtime.
* Each app can be developed and deployed separately, allowing independent updates.

### Role-Based Authentication

* Auth state is managed with `AuthContext` in the main app.
* After login, the user’s role (`admin` or `user`) is stored in context.
* Components and routes check the role before rendering:

  * **Admin** → can access management features.
  * **User** → limited to browsing/viewing.

---

## Live Demo

* [Main App] -> https://music-app-88rp.vercel.app/
* [Music Library] -> https://music-app-murex-delta.vercel.app/

---

## License

MIT
