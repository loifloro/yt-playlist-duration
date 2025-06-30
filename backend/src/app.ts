import { errorHandler } from "./middleware/errorHandler";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import playlistRoutes from "./routes/playlistRoutes";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// Connect to Mongodb database
mongoose
    .connect(process.env.DATABASE_URL!)
    .then(() => {
        console.log("Database connected");
    })
    .catch(() => {
        console.log("Database disconnected");
    });

// Routes
app.use("/api/playlist", playlistRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
