"use server";

import {
    getPlaylist,
    getPlaylistItems,
    getPlaylistId,
    getVideoDetails,
    getVideoIds,
    getPlaylistDuration,
} from "../utils/playlist";
import { isNull } from "lodash";
import { Playlist } from "../types/playlist";

export default async function calculatePlaylistLength(
    _previousState:
        | undefined
        | null
        | {
              playlist: Playlist;
              totalLength: string;
          },
    formData: FormData
) {
    const playlistId = getPlaylistId(formData.get("playlistUrl"));

    if (isNull(playlistId)) {
        return null;
    }

    const playlist = await getPlaylist(playlistId);

    if (isNull(playlist)) {
        return null;
    }

    console.log(playlist);

    return {
        playlist,
        imgUrl: playlist.snippet.thumbnails["maxres"].url,
        totalLength: getPlaylistDuration(
            await getVideoDetails(
                getVideoIds(await getPlaylistItems(playlistId))
            )
        ),
    };
}
