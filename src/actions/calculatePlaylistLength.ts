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

    return {
        playlist,
        totalLength: getPlaylistDuration(
            await getVideoDetails(
                getVideoIds(await getPlaylistItems(playlistId))
            )
        ),
    };
}

// https://www.youtube.com/watch?v=_GwFUr5VBxo&list=PL2ZSC63lrokkacGXp590GdImBgRDS8Bib
// https://youtube.com/playlist?list=PLSHv_e8U7Z-16Ikm3A8eYTF4jhQ_xgXBg&si=eESLadQk96SNHQdO
