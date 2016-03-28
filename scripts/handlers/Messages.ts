/// <reference path="../../typings/browser.d.ts" />
export class LoadMyAudio {
}

export class MyAudioLoaded {
    constructor(public audio: AudioInfo[]) { }
}

export class SearchAudio {
    constructor(public query: string) {}
}

export class SearchAudioResultLoaded {
    constructor(public audio: AudioInfo[]) {}
}

export class AudioInfoUpdated {
    constructor(public audio: AudioInfo) { }
}

export class DownloadAudio {
    constructor(public audio: AudioInfo[]) { }
}