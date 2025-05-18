import { isNull } from "lodash";
import { Playlist } from "@models/playlist";
import { Request, Response, NextFunction } from "express";

export const getPlaylistById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const playlist = await new Playlist({
            id: req.params.playlistId,
        }).init();

        if (isNull(playlist.details)) {
            res.status(400).json({ message: "No playlist found on this id" });

            return;
        }

        res.status(200).json({
            details: playlist.details,
            imgUrl: playlist.details?.snippet.thumbnails["maxres"].url,
            totalLength: await playlist.getPlaylistDuration(),
        });
    } catch (error) {
        next(error);
    }
};
