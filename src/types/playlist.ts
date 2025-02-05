export type PlaylistListResponse = {
    kind: "youtube#playlistListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Playlist[];
};

export type Playlist = {
    kind: "youtube#playlist";
    etag: string;
    id: string;
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            (key: number): {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        defaultLanguage: string;
        localized: {
            title: string;
            description: string;
        };
    };
    contentDetails: {
        itemCount: number;
    };
};

export type PlaylistItem = {
    kind: "youtube#playlistItem";
    etag: string;
    id: string;
    snippet: {
        publishedAt: Date;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            (key: number): {
                url: string;
                width: number;
                height: number;
            };
        };
        channelTitle: string;
        videoOwnerChannelTitle: string;
        videoOwnerChannelId: string;
        playlistId: string;
        position: number;
        resourceId: {
            kind: string;
            videoId: string;
        };
    };
    contentDetails: {
        videoId: string;
        startAt: string;
        endAt: string;
        note: string;
        videoPublishedAt: Date;
    };
    status: {
        privacyStatus: string;
    };
};

export type PlaylistItems = {
    kind: "youtube#playlistItemListResponse";
    etag: number;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: PlaylistItem[];
};
