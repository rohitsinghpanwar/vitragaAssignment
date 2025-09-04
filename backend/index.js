import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL
}));
app.use(express.json());
const PORT = process.env.PORT || 4000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

let cachedUpdates = '';
let lastFetchTime = 0;

async function githubEvents() {
  const now = Date.now();
  if (cachedUpdates && now - lastFetchTime < 5 * 60 * 1000) {
    return cachedUpdates;
  }

  const { data } = await axios.get("https://api.github.com/events",{
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "Vitraga-Frontend"
    },
  });
  cachedUpdates = data
    .slice(0, 5)
    .map((e) => `• ${e.type} by ${e.actor.login}`)
    .join("\n");
  lastFetchTime = now;
  return cachedUpdates;
}

// Send Email
async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
}

app.post("/submit", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const updates = await githubEvents();
    const { data: existing, error: selectError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (selectError) {
      console.error(selectError);
      return res.status(500).json({ message: "Database error" });
    }

    if (existing?.length > 0) {
      await sendEmail(email, "Welcome Back", `Your GitHub Updates and i have set a cronjob so you will get daily github updates at 10 AM:\n\n${updates}`);
      return res.status(200).json({ message: "Email already exists, sent updates" });
    }

    const { error } = await supabase.from("users").insert([{ email }]);
    if (error) return res.status(400).json({ message: error.message });

    await sendEmail(email, "Welcome!", `Your GitHub Updates and i have set a cronjob so you will get daily github updates at 10 AM:\n\n${updates}`);
    return res.status(200).json({ message: "Email submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

async function githubUpdate() {
  try {
    const { data: users } = await supabase.from("users").select("email");
    if (!users?.length) {
      console.log("⚠️ No users to send updates to.");
      return;
    }

    const updates = await githubEvents();
    for (let user of users) {
      await sendEmail(user.email, "Your Daily GitHub Events", updates);
    }
    console.log("All emails sent successfully!");
  } catch (error) {
    console.error("Error sending updates:", error);
  }
}

app.get("/",(req,res)=>{
    res.send("Don't worry the server is up and running like Tom Cruise!")
})

// Run cron job every day at 10 AM
cron.schedule("30 4 * * *", () => {
  console.log("Running Cronjob for daily GitHub updates...");
  githubUpdate();
});

app.listen(PORT || 4000, () => console.log(`Server is running at ${PORT}`));
