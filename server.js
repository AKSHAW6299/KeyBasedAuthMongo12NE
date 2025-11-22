import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectToDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

