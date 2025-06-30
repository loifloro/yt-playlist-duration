import { PlaylistDurationPerTime } from "./playlist";

export type ApiResponse = {
    details: Playlist;
    imgUrl: string;
    redirectUrl: string;
    totalLength: {
        inMilliseconds: number;
        inSeconds: PlaylistDurationPerTime;
        inMinutes: PlaylistDurationPerTime;
        inHours: PlaylistDurationPerTime;
        inDays: PlaylistDurationPerTime;
    };
};
