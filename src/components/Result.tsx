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
            className="my-5 md:my-10 rounded-lg overflow-hidden h-fit w-fit"
            style={{ backgroundImage: `url(${imgUrl})` }}
        >
            <div className="px-4 py-5 backdrop-blur-3xl  flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                    src={imgUrl}
                    alt={description}
                    className="rounded-md sm:w-80"
                />
                <div>
                    <h2 className="text-xl font-semibold mb-2">{length}</h2>
                    <h3 className="text-md/7">{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}
