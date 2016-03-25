/// <reference path="../../typings/browser.d.ts" />
export class LoadMyAudio {

}

export class MyAudioLoaded {
    constructor(public audio: AudioInfo[]) { }
}

export class AudioSizeLoaded {
    constructor(public audio: AudioInfo) { }
}