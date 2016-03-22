/// <reference path="../../typings/browser.d.ts"/>

interface ApiResponse<TResponse> {
    response: TResponse
}

interface IAuthorizationInfo {
    token: string;
    userId: number;
}

interface AudioRecord {
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

interface IVkApiService {
    currentUser(): number;
    myAudio(): ng.IPromise<AudioRecord[]>;
    searchAudio(query: string): ng.IPromise<AudioRecord[]>;
    getFileSize(audioId: number, fileUrl: string): ng.IPromise<number>;
    addAudio(audioId: number, ownerId: number): ng.IPromise<any>;
}

interface UserAudioResponse {
    count: number;
    items: AudioRecord[];
} 
