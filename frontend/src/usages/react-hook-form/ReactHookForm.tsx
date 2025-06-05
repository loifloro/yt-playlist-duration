import { ApiResponse } from "@typings/api";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getPlaylistId } from "@utils/playlist";
import { isNil } from "lodash";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Nullable } from "@typings/index";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Result from "@components/Result";
import ResultSkeleton from "@components/ResultSkeleton";

const schema = z.object({
    playlistUrl: z.string().url("Invalid URL Playlist"),
});

type Schema = z.infer<typeof schema>;

export default function ReactHookForm() {
    const [result, setResult] = useState<Nullable<ApiResponse>>();
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<Schema>({
        defaultValues: {
            playlistUrl: !isNil(searchParams.get("url"))
                ? searchParams.get("url")!
                : "",
        },
        resolver: zodResolver(schema),
    });

    const onSubmit = useCallback(
        async (data: Schema) => {
            try {
                setIsLoading(true);

                setSearchParams((prevParams) => {
                    prevParams.set("url", data.playlistUrl);
                    return prevParams;
                });

                const result = await fetch(
                    `${import.meta.env.VITE_API_SERVER}/api/playlist/${getPlaylistId(data.playlistUrl)}`,
                    {
                        credentials: "same-origin",
                        method: "GET",
                    }
                );

                if (!result.ok) {
                    const parsedResult: { message: string } =
                        await result.json();

                    setResult(null);
                    setError("playlistUrl", { message: parsedResult.message });

                    return null;
                }

                const parsedResult: Nullable<ApiResponse> = await result.json();

                setResult(parsedResult);

                return;
            } catch (e: unknown) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        },
        [setSearchParams, setError]
    );

    const hasError = errors.playlistUrl?.message;

    useEffect(() => {
        if (searchParams.has("url") && isNil(result) && !isLoading) {
            handleSubmit(onSubmit)();
        }
    }, [handleSubmit, onSubmit, result, searchParams, isLoading]);

    return (
        <Fragment>
            <div className="flex flex-col gap-1 justify-center w-full">
                <label
                    htmlFor="playlistUrl"
                    className="font-normal text-zinc-400"
                >
                    Paste the playlist link here
                </label>
                <form
                    className={`border focus-within:border-2 focus-within:border-zinc-300 overflow-hidden rounded-full h-12 bg-neutral-900/40 flex justify-between pl-4 w-full ${hasError ? "border-red-700 text-red-100" : "border-zinc-500 "}`}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        required
                        className="playlist-url-input"
                        placeholder="https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1"
                        autoComplete="off"
                        {...register("playlistUrl")}
                    />
                    <button
                        type="submit"
                        className="bg-neutral-800 h-full px-4 cursor-pointer"
                    >
                        <MagnifyingGlassIcon className="fill-neutral-50 h-6 w-6" />
                    </button>
                </form>
                <div className="text-red-700">
                    {hasError && <p>{errors.playlistUrl?.message}</p>}
                </div>
            </div>
            {isLoading && <ResultSkeleton />}
            {!isLoading && !isNil(result) && (
                <Result
                    details={result?.details}
                    length={result?.totalLength}
                    imgUrl={result?.imgUrl}
                />
            )}
        </Fragment>
    );
}
