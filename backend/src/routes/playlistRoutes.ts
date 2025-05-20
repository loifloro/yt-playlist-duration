import { getPlaylistById } from "@controllers/playlistController";
import { Router } from "express";

const router = Router();

router.get("/:playlistId", getPlaylistById);

export default router;
