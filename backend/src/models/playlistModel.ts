import mongoose, { Schema } from "mongoose";

const DurationMapSchema = {
    type: Map,
    of: String,
    default: {}, // Optional: ensures map exists
};

const PlaylistSchema = new Schema(
    {
        playlistId: {
            type: String,
            required: true,
        },
        channelId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        thumbnailUrl: {
            type: String,
            required: true,
        },
        redirectUrl: {
            type: String,
            required: true,
        },
        length: {
            inMilliseconds: Number,
            inSeconds: DurationMapSchema,
            inMinutes: DurationMapSchema,
            inHours: DurationMapSchema,
            inDays: DurationMapSchema,
        },
        numberOfVideos: {
            type: Number,
            required: true,
        },
        searchedAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Playlist = mongoose.model("Playlist", PlaylistSchema);
