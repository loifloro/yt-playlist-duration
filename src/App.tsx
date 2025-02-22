import { GitHubLogoIcon, SunIcon } from "@radix-ui/react-icons";
import Form from "./components/Form";
import Logo from "./components/Logo";

export default function App() {
    return (
        <div className="min-h-screen bg-zinc-950 w-full text-neutral-50 flex flex-col justify-between">
            <header className="flex justify-between items-center p-4">
                <Logo />
                <div className="flex gap-4 sm:gap-8">
                    <a
                        href="https://github.com/loifloro/yt-playlist-duration"
                        target="_blank"
                    >
                        <GitHubLogoIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </a>
                    <SunIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
            </header>
            <main className="grid place-content-center p-4">
                <div className="my-[20vh]">
                    <h1 className="text-xl mb-10 text-center">
                        Having trouble estimating the length of a playlist?
                    </h1>
                    <Form />
                </div>
            </main>
            <footer className="flex justify-center p-4 border-t-[1px] border-t-neutral-800">
                <p className="text-center text-neutral-600">
                    Made by John Lois Floro
                </p>
            </footer>
        </div>
    );
}
