import { Duration } from "luxon";
import { Playlist, PlaylistDurationResponse } from "@typings/playlist";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Filter from "./Filter";

type ResultProps = {
    details: Playlist;
    length: PlaylistDurationResponse;
    imgUrl: string;
};

export default function Result({ details, length, imgUrl }: ResultProps) {
    const [searchParams] = useSearchParams();

    const [timeFormat, setTimeFormat] = useState<TimeFormat>(() => {
        const inMilliseconds = Duration.fromMillis(length.inMilliseconds)
            .rescale()
            .toObject();

        if (searchParams.has("timeFormat")) {
            return searchParams.get("timeFormat") as TimeFormat;
        } else if (inMilliseconds.days) {
            return "dd";
        } else if (inMilliseconds.hours) {
            return "hh";
        } else if (inMilliseconds.minutes) {
            return "mm";
        }

        return "hh";
    });

    const [speed, setSpeed] = useState<Speed>(() => {
        if (searchParams.has("speed")) {
            return searchParams.get("speed") as Speed;
        }

        return "1";
    });

    const _length = useMemo(() => {
        switch (timeFormat) {
            case "dd":
                return length.inDays[speed];
            case "hh":
                return length.inHours[speed];
            case "mm":
                return length.inMinutes[speed];
        }
    }, [timeFormat, length, speed]);

    const handleTimeFormat = (timeFormat: TimeFormat) => {
        setTimeFormat(timeFormat);
    };

    const handleSpeed = (speed: Speed) => {
        setSpeed(speed);
    };

    return (
        <div className="flex flex-col items-end my-5 gap-2">
            <Filter setTimeFormat={handleTimeFormat} setSpeed={handleSpeed} />
            <div
                style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "100%",
                    backgroundPosition: "center",
                }}
                className="rounded-2xl overflow-hidden h-fit w-full lg:w-[48.75rem] outline-2 outline-neutral-800 -outline-offset-[.5px]"
            >
                <div className="p-4 md:pb-8 md:p-6 backdrop-blur-xl bg-black/60 flex flex-wrap md:flex-nowrap flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                    <img
                        src={imgUrl}
                        alt={details.snippet.description}
                        className="drop-shadow-lg object-cover md:w-80"
                    />
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl md:text-2xl font-normal mb-2">
                            {_length}
                        </h2>
                        <div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-[2px]">
                                    <h3 className="text-sm md:text-xl font-normal tracking-wide text-pretty">
                                        {details.snippet.title}
                                    </h3>
                                    <p className="text-sm md:text-base w-fit text-zinc-300 line-clamp-2">
                                        {details.snippet.description}
                                    </p>
                                </div>
                                <div className="flex">
                                    <span className="text-sm md:text-sm w-fit text-zinc-400">
                                        {details.contentDetails.itemCount}
                                        &nbsp;videos
                                    </span>
                                    {/* <span>•</span>
                                    <span></span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
