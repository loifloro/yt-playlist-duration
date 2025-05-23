import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import express from "express";
import playlistRoutes from "./routes/playlistRoutes";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// Routes
app.use("/api/playlist", playlistRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
