type ResultProps = {
    title: string;
    description: string;
    length: string;
    imgUrl: string;
};

export default function Result({
    title,
    description,
    length,
    imgUrl,
}: ResultProps) {
    return (
        <div
            className="my-5 md:my-10 rounded-lg md:rounded-xl overflow-hidden h-fit w-fit lg:max-w-4xl"
            style={{ backgroundImage: `url(${imgUrl})` }}
        >
            <div className="p-4 pb-8 md:p-8 backdrop-blur-xl bg-black/60 flex flex-wrap md:flex-nowrap flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                <img
                    src={imgUrl}
                    alt={description}
                    className="drop-shadow-lg object-cover md:w-80"
                />
                <div className="flex flex-col gap-6 md:gap-10">
                    <h2 className="text-xl md:text-2xl font-medium mb-2">
                        {length}
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
