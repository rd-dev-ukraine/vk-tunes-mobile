/// <reference path="../../typings/browser.d.ts"/>

interface ApiResponse<TResponse> {
    response: TResponse
}

interface IAuthorizationInfo {
    token: string;
    userId: number;
}

interface VkAudioRecord {
    id: number;
    owner_id: number;
    artist: string;
    title: string;
    duration: number;
    url: string;
    lyrics_id: number;
    album_id: number;
    genre_id: number;
}

interface StoredAudioRecord {
    id: number;
    name: string;
    path: string;
}

interface IAudioDownloadingProgress {
    audio_id: number;
    bytesLoaded: number
    bytesTotal: number
    percent: number
}