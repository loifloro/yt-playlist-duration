import { Duration } from "luxon";

type ResultProps = {
    title: string;
    description: string;
    length: {
        inMilliseconds: number;
        inSeconds: string;
        inMinutes: string;
        inHours: string;
        inDays: string;
    };
    imgUrl: string;
};

export default function Result({
    title,
    description,
    length,
    imgUrl,
}: ResultProps) {
    const _length = Duration.fromMillis(length.inMilliseconds)
        .rescale()
        .toHuman();

    return (
        <div
            className="my-5 md:my-10 rounded-xl md:rounded-xl overflow-hidden h-fit w-fit lg:w-[48.75rem]"
            style={{ backgroundImage: `url(${imgUrl})` }}
        >
            <div className="p-4 pb-8 md:p-6 backdrop-blur-xl bg-black/60 flex flex-wrap md:flex-nowrap flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <img
                    src={imgUrl}
                    alt={description}
                    className="drop-shadow-lg object-cover md:w-80"
                />
                <div className="flex flex-col gap-6 md:gap-10">
                    <h2 className="text-xl md:text-2xl font-medium mb-2">
                        {/* {_length} */}
                        {length.inHours}
                    </h2>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm md:text-lg text-pretty">
                            {title}
                        </h3>
                        <p className="text-xs w-fit text-zinc-400">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
