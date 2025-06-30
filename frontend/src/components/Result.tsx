import { Duration } from "luxon";
import { Playlist, PlaylistDurationResponse } from "@typings/playlist";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Filter from "./Filter";
import PlaylistItem from "./PlaylistItem";

type ResultProps = {
    details: Playlist;
    length: PlaylistDurationResponse;
    redirectUrl: string;
    imgUrl: string;
};

export default function Result({
    details,
    length,
    imgUrl,
    redirectUrl,
}: ResultProps) {
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
            <PlaylistItem
                redirectUrl={redirectUrl}
                imgUrl={imgUrl}
                length={_length}
                numberOfVideos={details.contentDetails.itemCount}
                title={details.snippet.title}
                description={details.snippet.description}
            />
        </div>
    );
}
