/// <reference path="../../typings/browser.d.ts" />
export class LoadMyAudio {

}

export class MyAudioLoaded {
    constructor(public audio: AudioRecord[]) {
    }
}

export class AudioSizeLoaded {
    constructor(public audio: AudioRecord,
                public fileSize: number) {
    }
}