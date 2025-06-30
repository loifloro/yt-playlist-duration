import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function ResultSkeleton() {
    return (
        <SkeletonTheme baseColor="#10161c" highlightColor="#0a0d10">
            <div className="rounded-2xl p-4 pb-8 md:p-6 bg-black/60 flex flex-col md:flex-row gap-10">
                <div className="md:w-80 aspect-3/2">
                    <Skeleton height="100%" />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="my-4 w-full h-[48px] md:min-w-[400px]">
                        <Skeleton height="100%" />
                    </div>
                    <Skeleton height={30} width="50%" />
                </div>
            </div>
        </SkeletonTheme>
    );
}
