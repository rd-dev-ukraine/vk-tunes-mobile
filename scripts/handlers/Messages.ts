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

export class DownloadProgress {
    constructor(public audio: AudioInfo, public progress: IAudioDownloadingProgress) {}
}

export class DownloadInfoNotification {
    constructor(public index: number, 
                public total: number ) {
    }
}

export class AddAudio {
    constructor(public audio: AudioInfo) {}
}

export class DeleteAudio {
    constructor(public audio: AudioInfo) {}
}

export class AudioDeleted {
    constructor(public audio: AudioInfo) {}
}