"use server";

import { ApiResponse } from "@typings/api";
import { getPlaylistId } from "@utils/playlist";
import { isNull } from "lodash";
import { Nullable } from "@typings/index";

export default async function calculatePlaylistLength(
    _previousState: Nullable<ApiResponse>,
    formData: FormData
) {
    const playlistId = getPlaylistId(formData.get("playlistUrl"));

    if (isNull(playlistId)) {
        return null;
    }

    try {
        const t = await fetch(
            `${import.meta.env.VITE_API_SERVER}/api/playlist/${playlistId}`,
            {
                credentials: "same-origin",
                method: "GET",
            }
        );

        if (!t.ok) {
            return null;
        }

        const x: Nullable<ApiResponse> = await t.json();

        return x;
    } catch (e) {
        console.log(e);
    }
}
