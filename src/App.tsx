import { isNil, isNull } from "lodash";
import { useActionState } from "react";
import calculatePlaylistLength from "./actions/calculatePlaylistLength";

export default function App() {
    const [state, formAction] = useActionState(calculatePlaylistLength, undefined);

    return (
        <>
            <form action={formAction}>
                <input type="url" name="playlistUrl" required />
                <button type="submit">Suvmt</button>
                {isNull(state) && <p>Invalid playlist URL</p>}
                {!isNil(state) && (
                    <>
                        {state.playlist.snippet.title}
                        {state.playlist.snippet.description}
                        {state.totalLength}
                    </>
                )}
            </form>
        </>
    );
}
