/// <reference path="../../typings/browser.d.ts"/>

import VkApi = require("VkApi");

class VkTypedApi {
    private api = new VkApi();

    currentUser() {
        return this.api.currentUser();
    }

    myAudio(): Promise<AudioRecord[]> {
        return this.api
                   .requestApi<UserAudioResponse>("audio.get", {})
                   .then((r: UserAudioResponse) => r.items);
    }

    searchAudio(query: string): Promise<AudioRecord[]> {
        return this.api
                   .requestApi<UserAudioResponse>(
                       "audio.search",
                       {
                           q: query,
                           search_own: 1,
                           count: 100
                       })
            .then((r: UserAudioResponse) => r.items);
    }

    getFileSize(audioId: number, fileUrl: string): Promise<number> {
        return fetch(fileUrl,
                     {
                        method: "HEAD"
                     })
                     .then(r => {
                         console.log(r);

                         let contentLength = r.headers.get("Content-Length");
                         return parseFloat(contentLength);
                     });
    }

    addAudio(audioId: number, ownerId: number): Promise<any> {
        return this.api
                   .requestApi<any>("audio.add", {
                                        audio_id: audioId,
                                        owner_id: ownerId
                                    });
    }
}

export = VkTypedApi;