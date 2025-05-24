"use server";

import { getPlaylistId } from "../utils/playlist";
import { isNull } from "lodash";
import { Playlist } from "../types/playlist";

type ApiResponse = {
    details: Playlist;
    imgUrl: string;
    totalLength: number;
};

export default async function calculatePlaylistLength(
    _previousState: Nullable<ApiResponse>,
    formData: FormData
) {
    const playlistId = getPlaylistId(formData.get("playlistUrl"));

    if (isNull(playlistId)) {
        return null;
    }

    const t = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/playlist/${playlistId}`
    );

    if (!t.ok) {
        return null;
    }

    const x: Nullable<ApiResponse> = await t.json();

    return x;
}
