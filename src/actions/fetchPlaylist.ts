"use server";

import { Playlist, PlaylistItems } from "../types/playlist";

export default async function fetchPlaylist(
    previousState: null | {
        playlist: Playlist;
        playlistItems: PlaylistItems;
    },
    formData: FormData
) {
    const playlistUrl = formData.get("playlistUrl");

    const playlist = await fetch(`https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=contentDetails&id=${playlistUrl}&key=${import.meta.env.VITE_API_KEY}`);

    const playlistItems = await fetch(
        `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&part=contentDetails&playlistId=${playlistUrl}&maxResults=50&pageToken=${""}&key=${
            import.meta.env.VITE_API_KEY
        }`
    );

    const playlistData: Playlist = await playlist.json();
    const playlistItemsData: PlaylistItems = await playlistItems.json();

    return {
        playlist: playlistData,
        playlistItems: playlistItemsData,
    };
}
