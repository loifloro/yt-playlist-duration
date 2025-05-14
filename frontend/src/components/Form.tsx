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
    const hasError = isNull(state);

    return (
        <>
            <div className="flex flex-col gap-1 justify-center w-full">
                <label
                    htmlFor="playlistUrl"
                    className="font-normal text-zinc-400"
                >
                    Paste the playlist link here
                </label>
                <form
                    action={formAction}
                    className={`border focus-within:border-2 focus-within:border-zinc-300 overflow-hidden rounded-full h-12 bg-neutral-900/40 flex justify-between pl-4 w-full ${hasError ? "border-red-700" : "border-zinc-500 "}`}
                >
                    <input
                        type="url"
                        name="playlistUrl"
                        required
                        className="focus-visible:outline-0 bg-transparent text-neutral-100 placeholder:font-normal placeholder:text-zinc-600 w-full truncate"
                        placeholder="https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="bg-neutral-800 h-full px-4 cursor-pointer"
                    >
                        <MagnifyingGlassIcon className="fill-neutral-50 h-6 w-6" />
                    </button>
                </form>
                <div className="text-red-700">
                    {hasError && <p>No playlist found on this URL</p>}
                </div>
            </div>
            <>
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
