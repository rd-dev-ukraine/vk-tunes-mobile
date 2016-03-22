/// <reference path="../../typings/browser.d.ts"/>

import VkApi = require("VkApi");

class VkService implements IVkApiService {
    static $inject = ["$q", "$http", VkApi.ServiceName];
    static ServiceName = "vk-service";

    constructor(
        private $q: ng.IQService,
        private $http: ng.IHttpService,
        private api: VkApi) {
    }

    currentUser() {
        return this.api.currentUser();
    }

    myAudio(): ng.IPromise<AudioRecord[]> {
        return this.api
            .requestApi<UserAudioResponse>("audio.get", {})
            .then((r: UserAudioResponse) => r.items);
    }

    searchAudio(query: string): ng.IPromise<AudioRecord[]> {
        return this.api
            .requestApi<UserAudioResponse>("audio.search", {
                q: query,
                search_own: 1,
                count: 100
            })
            .then((r: UserAudioResponse) => r.items);
    }

    getFileSize(audioId: number, fileUrl: string): ng.IPromise<number> {
        return this.$http
            .head(fileUrl, {
                timeout: 3000
            })
            .then(r => {
                return parseFloat(r.headers("Content-Length"));
            });
    }

    addAudio(audioId: number, ownerId: number): ng.IPromise<any> {
        return this.api.requestApi<any>("audio.add", {
            audio_id: audioId,
            owner_id: ownerId
        });
    }
}

export = VkService;