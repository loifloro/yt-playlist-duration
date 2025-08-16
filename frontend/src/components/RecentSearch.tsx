"use client";

import { Duration } from "luxon";
import { FetchedPlaylists, PlaylistDurationResponse } from "@typings/playlist";
import { isEmpty, isNull } from "lodash";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import PlaylistItem from "./PlaylistItem";
import ResultSkeleton from "./ResultSkeleton";

export default function RecentSearch() {
    const [isLoading, setIsLoading] = useState(true);
    const [opacity, setOpacity] = useState(0.2);
    const [playlists, setPlaylists] = useState<FetchedPlaylists>([]);
    const { scrollY } = useScroll();
    const ref = useRef<HTMLDivElement>(null);

    const getPlaylistLength = (length: PlaylistDurationResponse) => {
        const inMilliseconds = Duration.fromMillis(length.inMilliseconds)
            .rescale()
            .toObject();

        if (inMilliseconds.days) {
            return length.inDays["1"];
        } else if (inMilliseconds.hours) {
            return length.inHours["1"];
        } else if (inMilliseconds.minutes) {
            return length.inMinutes["1"];
        }

        return length.inSeconds["1"];
    };

    const getPlaylists = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await fetch(
                `${import.meta.env.VITE_API_SERVER}/api/playlist/`,
                {
                    credentials: "same-origin",
                    method: "GET",
                }
            );

            if (!result.ok) {
                setPlaylists([]);

                return;
            }

            const parsedResult: FetchedPlaylists = await result.json();

            setPlaylists(parsedResult);

            return;
        } catch (e: unknown) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useMotionValueEvent(scrollY, "change", (current) => {
        const center = window.innerHeight / 2;
        const diff = current - scrollY.getPrevious()!;

        if (isNull(ref.current)) {
            return;
        }

        if (ref.current.getBoundingClientRect().top <= center && opacity < 1) {
            setOpacity((prev) => prev + 0.1);
        }

        if (
            ref.current.getBoundingClientRect().top >= center &&
            opacity >= 0.2 &&
            diff <= 0
        ) {
            setOpacity((prev) => prev - 0.1);
        }
    });

    useEffect(() => {
        getPlaylists();
    }, [getPlaylists]);

    if (!isLoading && isEmpty(playlists)) {
        return null;
    }

    return (
        <motion.div ref={ref} className="my-20" animate={{ opacity: opacity }}>
            <h2 className="mb-3 text-[1.25rem] leading-[1.3] md:text-[1.5rem] md:leading-[1.2]">
                Recent Searches
            </h2>
            <div className="flex flex-col gap-6">
                {isLoading
                    ? Array.from({ length: 2 }, (_, index) => (
                          <ResultSkeleton key={index} />
                      ))
                    : playlists.map(
                          (
                              {
                                  numberOfVideos,
                                  thumbnailUrl,
                                  title,
                                  description,
                                  length,
                                  redirectUrl,
                              },
                              index
                          ) => (
                              <PlaylistItem
                                  redirectUrl={redirectUrl}
                                  key={index}
                                  imgUrl={thumbnailUrl}
                                  length={getPlaylistLength(length)}
                                  numberOfVideos={numberOfVideos}
                                  title={title}
                                  description={description}
                              />
                          )
                      )}
            </div>
        </motion.div>
    );
}
