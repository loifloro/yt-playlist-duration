import { isEmpty, isNull } from "lodash";
import { Playlist } from "@models/playlistModel";
import { PlaylistService } from "@services/playlistService";
import { Request, Response, NextFunction } from "express";
import { telegramBot } from "../telegramClient";

/** @todo use dry on the redirectUrl */
export const getPlaylistById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const playlist = new PlaylistService({ id: req.params.playlistId });

        await playlist.create();

        if (isNull(playlist.details)) {
            res.status(400).json({ message: "No playlist found on this url" });

            return;
        }

        if (
            isEmpty(
                await Playlist.find({
                    playlistId: req.params.playlistId,
                    numberOfVideos: playlist.details.contentDetails.itemCount,
                })
            )
        ) {
            Playlist.create({
                channelId: playlist.details.snippet.channelId,
                description: playlist.details.snippet.description,
                numberOfVideos: playlist.details.contentDetails.itemCount,
                playlistId: playlist.id,
                thumbnailUrl:
                    playlist.details?.snippet.thumbnails["default"].url,
                title: playlist.details.snippet.title,
                length: await playlist.getPlaylistDuration(),
                searchedAt: new Date(),
                redirectUrl: `https://www.youtube.com/watch?v=${playlist.playlistItems![0].snippet.resourceId.videoId}&list=${req.params.playlistId}`,
            });
        }

        telegramBot.telegram
            .sendMessage(
                process.env.TELEGRAM_CHAT_ID!,
                `Recent Search: ${playlist.details.snippet.title}\n\nhttps://www.youtube.com/watch?v=${playlist.playlistItems![0].snippet.resourceId.videoId}&list=${req.params.playlistId}
            `,
                { parse_mode: "HTML" }
            )
            .catch((err) => {
                console.log(
                    "Failed to send message:",
                    err.response?.description || err.message
                );
            });

        res.status(200).json({
            details: playlist.details,
            imgUrl: playlist.details?.snippet.thumbnails["maxres"].url,
            totalLength: await playlist.getPlaylistDuration(),
            redirectUrl: `https://www.youtube.com/watch?v=${playlist.playlistItems![0].snippet.resourceId.videoId}&list=${req.params.playlistId}`,
        });
    } catch (error) {
        next(error);
    }
};

export const getPlaylists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const playlists = await Playlist.find()
            .limit(10)
            .sort({ searchedAt: "desc" });

        res.status(200).json(playlists);
    } catch (error) {
        next(error);
    }
};
