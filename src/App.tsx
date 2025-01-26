import { useActionState } from "react";
import fetchPlaylist from "./actions/fetchPlaylist";

export default function App() {
    const [state, formAction] = useActionState(fetchPlaylist, null);

    console.log(state?.playlistItems);

    return (
        <>
            <form action={formAction}>
                <input type="text" name="playlistUrl" />
                <button type="submit">Suvmt</button>
            </form>
            {state && state.playlistItems.items.map((item) => <div key={item.id}>{item.snippet.title}</div>)}
        </>
    );
}
