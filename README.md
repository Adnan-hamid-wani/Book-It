#  BookIt — Fullstack Experience Booking Platform

BookIt is a **fullstack web app** built from a Figma design, enabling users to browse and book experiences such as “Highway Delite” and “LPU Journey”.  
It features a **React frontend**, a **Node.js + Express + MongoDB backend**, and supports promo codes, slot-based booking, and dynamic experience data.

---

##  Tech Stack

###  Frontend
- **React + Vite**
- **Axios** for API calls
- **Tailwind CSS** for styling
- **React Router** for navigation

###  Backend
- **Node.js + Express**
- **MongoDB + Mongoose** (no ORM migration needed)
- **TypeScript**
- **dotenv** for environment variables
- **CORS** for frontend-backend connection

---

## 📂 Folder Structure

BookIt_Figma_Exact/
│
├── frontend/ # React + Vite app
│ ├── src/
│ ├── package.json

│ └── vite.config.js
│
├── backend/ # Node + Express + MongoDB
│ ├── index.ts # Main server file (single file backend)
│ ├── seed.ts # MongoDB seeder script
│ ├── .env # Environment variables
│ └── package.json
│
└── README.md



---

##  Features

| Feature | Description |
|----------|--------------|
|  **Exact Figma UI** | Replicates the design exactly as provided |
|  **Search Interface** | Users can search and view listed experiences |
|  **Dynamic Cards** | Experiences are fetched from MongoDB and displayed dynamically |
|  **Slot-based Booking** | Each experience has available time slots with limited capacity |
|  **Promo Codes** | Supports flat and percent-based promo validation |
|  **Booking Confirmation** | User details and booking stored in MongoDB |
|  **Single-File Backend** | Entire backend logic (API + DB + routes) in one TypeScript file |
|  **Seeder Script** | Inserts initial data like “Highway Delite” & “LPU Journey” |

---

## ⚙️ Setup Instructions

###  1. Clone the Repository
```bash
git clone https://github.com/your-username/BookIt_Figma_Exact.git
cd BookIt_Figma_Exact
## 2. Backend Setup
Install Dependencies


cd backend
yarn add express mongoose cors dotenv
yarn add -D typescript @types/node @types/express ts-node
Environment File
Create .env inside /backend:


MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookit
PORT=4000
Seed Initial Data
bash
Copy code
npx ts-node seed.ts
Run Server
bash
Copy code
npx ts-node index.ts
Your server should run at ➜ http://localhost:4000

## 3. Frontend Setup
Install Dependencies



cd ../frontend
yarn install
Run Frontend


yarn dev
Your app runs at ➜ http://localhost:5173

## 4. Connecting Frontend & Backend
Backend runs on port 4000

Frontend runs on port 5173

The backend CORS configuration allows requests only from:


origin: "http://localhost:5173"
So, once both are running, visiting http://localhost:5173 will show live data fetched from MongoDB.

## Available API Endpoints
Method	Endpoint	Description
GET	/experiences	Fetch all experiences
GET	/experiences/:id	Fetch single experience with slots
POST	/promo/validate	Validate a promo code
POST	/bookings	Create a booking with user details

## Seeder Data Example
The seed.ts file inserts the following experiences into MongoDB:


[
  {
    title: "Highway Delite",
    description: "Roadside food and rest experience.",
    price: 1200,
    images: ["https://source.unsplash.com/random/800x600/?highway"],
    slots: [{ date: "2025-10-30", time: "10:00 AM", capacity: 10 }],
  },
  {
    title: "LPU Journey",
    description: "Campus life exploration and food court reviews.",
    price: 1500,
    images: ["https://source.unsplash.com/random/800x600/?college"],
    slots: [{ date: "2025-10-31", time: "11:00 AM", capacity: 12 }],
  },
];
## How the System Works
The frontend loads and calls /experiences to fetch all experiences.

The backend fetches data from MongoDB and returns JSON.

When a user selects an experience, the app calls /experiences/:id to load full details and slots.

When booking, /bookings API is called — data gets saved in MongoDB.


## Testing
You can use Postman to test backend endpoints:


GET  http://localhost:4000/experiences
GET  http://localhost:4000/experiences/<id>
POST http://localhost:4000/bookings
🏁 Deployment Guide
Frontend (Vercel)


yarn build
Deploy the /dist folder to Vercel.

Backend (Render / Railway)
Push backend to GitHub.

Connect repository to Render.

Set environment variables (MONGO_URI, PORT).

Deploy!

👨‍💻 Author
Adnan Hamid Wani
Fullstack Developer | MERN + AI Enthusiast
📧 adnanaduuu@gmail.com
🔗 LinkedIn | GitHub

📜 License
This project is licensed under the MIT License.



---

