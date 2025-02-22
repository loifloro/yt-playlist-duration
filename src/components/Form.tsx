"use client";

import { isNull, isNil } from "lodash";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useActionState } from "react";
import calculatePlaylistLength from "../actions/calculatePlaylistLength";
import Result from "./Result";

export default function Form() {
    const [state, formAction] = useActionState(
        calculatePlaylistLength,
        undefined
    );

    return (
        <>
            <div className="flex justify-center w-full">
                <form
                    action={formAction}
                    className="border border-neutral-700 focus-within:border-2 focus-within:border-neutral-300 overflow-hidden rounded-full h-10 bg-neutral-900/40 flex justify-between pl-4 w-full md:w-[732px]"
                >
                    <input
                        type="url"
                        name="playlistUrl"
                        required
                        className="focus-visible:outline-0 bg-transparent text-neutral-100 placeholder:font-normal placeholder:text-neutral-600 w-full truncate"
                        placeholder="Enter Playlist URL"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="bg-neutral-600 h-full px-4"
                    >
                        <MagnifyingGlassIcon className="fill-neutral-50 h-6 w-6" />
                    </button>
                </form>
            </div>
            <>
                {isNull(state) && <p>Invalid playlist URL</p>}
                {!isNil(state) && (
                    <Result
                        title={state.playlist.snippet.title}
                        description={state.playlist.snippet.description}
                        length={state.totalLength}
                        imgUrl={state.imgUrl}
                    />
                )}
            </>
        </>
    );
}
