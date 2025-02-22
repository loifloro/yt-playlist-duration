export default function Logo() {
    return (
        <div className="flex gap-2 items-center">
            <img
                alt="Youtube Playlist Duration Calculator Logo"
                src="./src/assets/logo.svg"
                className="h-7 sm:h-9"
            />
            <div className="text-sm sm:text-md">
                <div>Youtube Playlist Duration</div>
                <div>Calculator</div>
            </div>
        </div>
    );
}
