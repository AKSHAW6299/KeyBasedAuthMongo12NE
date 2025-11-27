import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors'; // <-- import cors

dotenv.config();
connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());


// Allow CORS from all origins (or restrict to your frontend URL)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*" // e.g., "http://localhost:3000"
}));

// Routes
app.use("/api/auth", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

