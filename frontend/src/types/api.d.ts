export type ApiResponse = {
    details: Playlist;
    imgUrl: string;
    totalLength: {
        inMilliseconds: number;
        inSeconds: string;
        inMinutes: string;
        inHours: string;
        inDays: string;
    };
};
