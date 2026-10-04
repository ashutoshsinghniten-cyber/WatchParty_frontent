# Watch Party – Frontend

React + Vite client with the YouTube IFrame player and Socket.IO client.

## Structure

src/
├── App.jsx, main.jsx, socket.js
├── hooks/useRoom.js        # socket events -> React state
├── components/             # Home, Room, VideoPlayer, Controls, ParticipantList, RequestsPanel, Chat
├── utils/youtube.js
└── styles/app.css


## Run locally
Start the backend first (see backend README), then:
bash
npm install
npm run dev     # http://localhost:5173


## Deploy on Vercel
1. Push this folder to its own GitHub repo.
2. vercel.com -> Add New -> Project -> import the repo (Framework: Vite is auto-detected).
3. Settings -> Environment Variables: `VITE_SERVER_URL` = your backend URL (e.g. https://watch-party-api.onrender.com).
4. Deploy. Copy your Vercel URL and put it in the backend's `CLIENT_ORIGIN` on Render, then redeploy the backend.
Note: Vite bakes env vars at build time, so redeploy the frontend after changing `VITE_SERVER_URL`.
