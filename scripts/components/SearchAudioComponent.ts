/// <reference path="../../typings/browser.d.ts" />
import PS = require("../pub-sub/Decorators");
import Messages = require("../handlers/Messages");

@PS.Subscriber
class SearchAudioController {
    static $inject = ["$scope"];

    query: string;
    audio: AudioInfo[]

    constructor(private $scope: ng.IScope) {
    }

    $onInit() {
        this.$scope.$watch(() => this.query, () => this.reloadAudio());
    }

    reloadAudio() {
        if (this.query)
            this.publish(new Messages.SearchAudio(this.query));
        else
            this.audio = [];
    }

    @PS.Handle(Messages.SearchAudioResultLoaded)
    onAudioLoaded(message: Messages.SearchAudioResultLoaded) {
        this.audio = message.audio;
        this.$scope.$$phase || this.$scope.$digest();
    }

    publish(message: any) {}
}

export var Component: ng.IComponentOptions = {
    controller: SearchAudioController,
    controllerAs: "$c",
    template:
`
<h2>Search audio</h2>
<div>
    <input ng-model="$c.query"
        ng-model-options="{ debounce: 100 }"
        type="text" />
</div>
<audio-list audio="$c.audio"></audio-list>
`
};