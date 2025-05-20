import appLogo from "../assets/logo.svg";

export default function Logo() {
    return (
        <div className="flex gap-2 items-center">
            <img
                alt="Youtube Playlist Duration Calculator Logo"
                src={appLogo}
                className="h-7 sm:h-9"
            />
            <div className="text-sm sm:text-md">
                <div>Youtube Playlist Duration</div>
                <div>Calculator</div>
            </div>
        </div>
    );
}
