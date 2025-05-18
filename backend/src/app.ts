import express from "express";
import cors from "cors";
import playlistRoutes from "./routes/playlistRoutes";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// Routes
app.use("/api/playlist", playlistRoutes);

export default app;
