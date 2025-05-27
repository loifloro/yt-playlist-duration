import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Form from "./components/Form";
import Logo from "./components/Logo";
import ReactHookForm from "./usages/react-hook-form/ReactHookForm";

export default function App() {
    return (
        <div className="min-h-screen bg-zinc-950 w-full text-neutral-50 flex flex-col justify-between gap-[200px]">
            <header className="flex justify-between items-center px-5 mt-8 md:px-15 md:mt-10">
                <Logo />
                <div className="flex gap-4 sm:gap-8">
                    <a
                        href="https://github.com/loifloro/yt-playlist-duration"
                        target="_blank"
                    >
                        <GitHubLogoIcon className="cursor-pointer h-6 w-6 sm:h-7 sm:w-7" />
                    </a>
                    {/* <SunIcon className="cursor-pointer h-6 w-6 sm:h-7 sm:w-7" /> */}
                </div>
            </header>
            <main className="grid place-content-center p-4">
                <div className="-mt-16 pb-16">
                    <h1 className="text-[1.75rem] leading-[1.3] md:text-[2.75rem] md:leading-[1.2] mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-red-600 to-red-500">
                        Hi there, binge-watcher <br />
                        What playlist you want to calculate?
                    </h1>
                    <ReactHookForm />
                    {/* <Form /> */}
                </div>
            </main>
            <footer className="flex justify-center p-4 border-t-[1px] border-y-neutral-900">
                <p className="text-center text-neutral-900">
                    Made by&nbsp;
                    <a
                        href="https://loix.vercel.app/"
                        target="_blank"
                        className="text-neutral-800"
                    >
                        John Lois Floro
                    </a>
                </p>
            </footer>
        </div>
    );
}
