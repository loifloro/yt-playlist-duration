import { getPlaylistById, getPlaylists } from "@controllers/playlistController";
import { Router } from "express";

const router = Router();

router.get("/:playlistId", getPlaylistById);
router.get("/", getPlaylists);

export default router;
