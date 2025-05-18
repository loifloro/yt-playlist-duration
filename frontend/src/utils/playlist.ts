import { isEmpty, isEqual, isNull } from "lodash";

export function getPlaylistId(url: FormDataEntryValue | null): string | null {
    const _url = isNull(url) ? null : new URL(url as string);

    if (isNull(_url)) {
        return null;
    }

    if (!isEqual(_url.hostname.replace(/^www\./, ""), "youtube.com")) {
        return null;
    }

    if (
        !_url.searchParams.has("list") ||
        isEmpty(_url.searchParams.get("list"))
    ) {
        return null;
    }

    return _url.searchParams.get("list");
}
