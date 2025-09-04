📩 Vitraga Assignment

A simple full-stack project that:

Captures a user’s email via a signup form (Frontend in React).

Stores emails in Supabase (Backend with Express).

Sends GitHub updates via email to the user upon submission.

Includes a daily cron job that sends updates to all users at 10:00 AM IST.

🚀 Live Links

🔗 Frontend: https://vitraga-assignment-taupe.vercel.app/

🔗 Backend API: https://vitragaassignment.onrender.com/

🛠️ Tech Stack

Frontend: React (Vite), Axios, TailwindCSS

Backend: Node.js, Express.js, Supabase, Nodemailer

Database: Supabase

Email Service: Gmail (via Nodemailer)

Cron Jobs: node-cron

Deployment:

Frontend → Vercel

Backend → Render

📦 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/yourusername/vitraga-assignment.git

2️⃣ Backend Setup
Install dependencies:
cd backend
npm install

Create a .env file:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=your_frontend_url


⚠️ If you use Gmail with 2FA, generate an App Password for Nodemailer.

Start Backend:
node index.js


Your backend will run at:

http://localhost:4000

3️⃣ Frontend Setup
Install dependencies:
cd frontend
npm install

Create a .env file in frontend:
VITE_BACKEND_URL=http://localhost:4000

Start Frontend:
npm run dev


Your frontend will run at:

http://localhost:5173

✨ Features

✅ Email Capture:
Users submit their email through the frontend, and it gets saved in Supabase.

✅ Instant Email:
When a user submits their email, they immediately receive a GitHub Events Update email.

✅ Daily Cron Job:
A cron job runs every day at 10:00 AM IST, sending the latest GitHub updates to all stored emails.

⏰ Cron Job Code
cron.schedule("30 4 * * *", () => {
  console.log("⏰ Running daily GitHub updates...");
  githubUpdate();
});


📝 This means:

30 4 * * * → Runs at 04:30 UTC, which is 10:00 AM IST.

Sends GitHub event updates to all registered users.

📡 API Endpoints
Method	Endpoint	Description
POST	/submit	Store email & send instant email
GET	/	Health check endpoint
📬 How Emails Look

Example email body:

Daily GitHub Updates at 10 AM

• PushEvent by octocat
• CreateEvent by hubot
• WatchEvent by developer
...