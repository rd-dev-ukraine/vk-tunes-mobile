/// <reference path="../../typings/browser.d.ts" />
export class MyAudioLoad {
    
}

export class MyAudioLoaded {
    constructor(public audio: AudioRecord[]) {        
    }
}

export class AudioSizeLoaded {
    constructor(public audio: AudioRecord, fileSize: number) {        
    }
}