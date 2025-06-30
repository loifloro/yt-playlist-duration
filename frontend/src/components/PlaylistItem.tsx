import { Link } from "react-router";

type PlaylistItem = {
    imgUrl: string;
    description?: string;
    length: string;
    title: string;
    redirectUrl: string;
    numberOfVideos: number;
};

export default function PlaylistItem({
    imgUrl,
    description,
    length,
    title,
    numberOfVideos,
    redirectUrl,
}: PlaylistItem) {
    console.log(redirectUrl);
    return (
        <Link to={redirectUrl} target="_blank">
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
                        alt={description}
                        className="drop-shadow-lg object-cover md:w-80"
                    />
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl md:text-2xl font-normal mb-2">
                            {length}
                        </h2>
                        <div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-[2px]">
                                    <h3 className="text-sm md:text-xl font-normal tracking-wide text-pretty">
                                        {title}
                                    </h3>
                                    <p className="text-sm md:text-base w-fit text-zinc-300 line-clamp-2">
                                        {description}
                                    </p>
                                </div>
                                <div className="flex">
                                    <span className="text-sm md:text-sm w-fit text-zinc-400">
                                        {numberOfVideos}
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
        </Link>
    );
}
