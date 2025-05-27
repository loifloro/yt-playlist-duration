import { Duration } from "luxon";
import { isEmpty, isNull, isUndefined } from "lodash";
import {
    PlaylistItem,
    PlaylistItems,
    PlaylistListResponse,
    Playlist as PlaylistType,
} from "@typings/playlist";
import { Video } from "@typings/video";

export class Playlist {
    id: string;
    details: PlaylistType | null = null;
    playlistItems?: PlaylistItem[];

    constructor(playlistData: { id: string }) {
        this.id = playlistData.id;
    }

    async create() {
        this.details = await this.getDetails();

        if (!isNull(this.details)) {
            this.playlistItems = await this.getPlaylistItems();
        }

        return this;
    }

    private async getDetails() {
        const playlist = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=contentDetails&id=${this.id}&key=${process.env.API_KEY}`
        );

        const playlistData: PlaylistListResponse | undefined =
            await playlist.json();

        if (isUndefined(playlist) || isEmpty(playlistData?.items)) {
            return null;
        }

        return playlistData!.items[0];
    }

    private async getPlaylistItems(
        nextPageToken = "",
        playlistItems: PlaylistItem[] = []
    ): Promise<PlaylistItem[]> {
        const playlistPage = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId=${this.id}&maxResults=50&pageToken=${nextPageToken}&key=${
                process.env.API_KEY
            }`
        );
        const playlistPageData: PlaylistItems = await playlistPage.json();

        playlistItems.push(...playlistPageData.items);

        if (!isUndefined(playlistPageData.nextPageToken)) {
            return await this.getPlaylistItems(
                playlistPageData.nextPageToken,
                playlistItems
            );
        }

        return playlistItems;
    }

    private async getVideoDetails(
        videoIds: string[],
        videoDetails: Video[] = [],
        currentIndex: number = 0
    ): Promise<Video[]> {
        const _videoIds = videoIds
            .slice(currentIndex, currentIndex + 50)
            .join(",");

        const videos = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${_videoIds}&key=${process.env.API_KEY}`
        );

        const videosData = await videos.json();

        videoDetails.push(...videosData.items);

        if (videoIds.length > currentIndex) {
            return await this.getVideoDetails(
                videoIds,
                videoDetails,
                currentIndex + 50
            );
        }

        return videoDetails;
    }

    /**
     * Returns the duration of a Youtube Playlist in different format
     *
     * @async
     * @returns {Promise<{inMilliseconds: number; inSeconds: string; inMinutes: string; inHours: string; inDays: string;}>}
     */
    async getPlaylistDuration(): Promise<{
        inMilliseconds: number;
        inSeconds: string;
        inMinutes: string;
        inHours: string;
        inDays: string;
    }> {
        const videoIds = this.playlistItems?.map(
            (item) => item.snippet.resourceId.videoId
        );
        const videos = await this.getVideoDetails(videoIds!);

        const videoDurations = videos.map((video) =>
            Duration.fromISO(video.contentDetails.duration).toMillis()
        );

        const duration = Duration.fromDurationLike(
            videoDurations
                .filter((item) => !isNaN(item))
                .reduce((acc, duration) => acc + duration)
        );

        return {
            inMilliseconds: duration.toMillis(),
            inSeconds: duration.toFormat("s 'seconds'"),
            inMinutes: duration.toFormat("mm 'minutes', ss 'seconds'"),
            inHours: duration.toFormat(
                "hh 'hours', mm 'minutes', ss 'seconds'"
            ),
            inDays: duration.toFormat(
                "d 'days', hh 'hours', mm 'minutes', ss 'seconds'"
            ),
        };
    }
}
