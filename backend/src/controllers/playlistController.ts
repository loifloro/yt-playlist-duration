import { isNull } from "lodash";
import { Playlist } from "@models/playlist";
import { Request, Response, NextFunction } from "express";
import { telegramBot } from "../telegramClient";

export const getPlaylistById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const playlist = new Playlist({ id: req.params.playlistId });

        await playlist.create();

        if (isNull(playlist.details)) {
            res.status(400).json({ message: "No playlist found on this url" });

            return;
        }

        telegramBot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT_ID!,
            `Recent Search: ${playlist.details.snippet.title}\n\nhttps://www.youtube.com/watch?v=${playlist.playlistItems![0].snippet.resourceId.videoId}=&list=${req.params.playlistId}
            `,
            { parse_mode: "HTML" }
        );

        res.status(200);

        res.status(200).json({
            details: playlist.details,
            imgUrl: playlist.details?.snippet.thumbnails["maxres"].url,
            totalLength: await playlist.getPlaylistDuration(),
        });
    } catch (error) {
        next(error);
    }
};
