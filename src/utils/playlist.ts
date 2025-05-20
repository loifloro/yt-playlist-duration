import { Duration } from "luxon";
import { isEmpty, isEqual, isNaN, isNull, isUndefined } from "lodash";
import {
    PlaylistItem,
    PlaylistItems,
    PlaylistListResponse,
} from "../types/playlist";
import { Video } from "../types/video";

export function getPlaylistId(url: FormDataEntryValue | null): string | null {
    const _url = isNull(url) ? null : new URL(url as string);

    if (isNull(_url)) {
        return null;
    }

    if (!isEqual(_url.hostname.replace(/^www\./, ""), "youtube.com")) {
        return null;
    }

    if (
        !_url.searchParams.has("list") ||
        isEmpty(_url.searchParams.get("list"))
    ) {
        return null;
    }

    return _url.searchParams.get("list");
}

export async function getPlaylist(playlistId: string) {
    const playlist = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=contentDetails&id=${playlistId}&key=${import.meta.env.VITE_API_KEY}`
    );

    const playlistData: PlaylistListResponse = await playlist.json();

    if (isEmpty(playlistData.items)) {
        return null;
    }

    return playlistData.items[0];
}

export async function getPlaylistItems(
    playlistId: string,
    nextPageToken = "",
    playlistItems: PlaylistItem[] = []
) {
    const playlistPage = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${
            import.meta.env.VITE_API_KEY
        }`
    );
    const playlistPageData: PlaylistItems = await playlistPage.json();

    playlistItems.push(...playlistPageData.items);

    if (!isUndefined(playlistPageData.nextPageToken)) {
        return await getPlaylistItems(
            playlistId,
            playlistPageData.nextPageToken,
            playlistItems
        );
    }

    return playlistItems;
}

export function getVideoIds(playlistItems: PlaylistItem[]) {
    return playlistItems.map((item) => item.snippet.resourceId.videoId);
}

export async function getVideoDetails(
    videoIds: string[],
    videoDetails: Video[] = [],
    currentIndex: number = 0
) {
    const _videoIds = videoIds.slice(currentIndex, currentIndex + 50).join(",");

    const videos = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${_videoIds}&key=${import.meta.env.VITE_API_KEY}`
    );

    const videosData = await videos.json();

    videoDetails.push(...videosData.items);

    if (videoIds.length > currentIndex) {
        return await getVideoDetails(videoIds, videoDetails, currentIndex + 50);
    }

    return videoDetails;
}

export function getPlaylistDuration(videos: Video[]) {
    const videoDurations = videos.map((video) =>
        Duration.fromISO(video.contentDetails.duration).toMillis()
    );

    return Duration.fromDurationLike(
        videoDurations
            .filter((item) => !isNaN(item))
            .reduce((acc, duration) => acc + duration)
    )
        .rescale()
        .toHuman();
}
