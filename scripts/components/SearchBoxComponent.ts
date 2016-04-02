/// <reference path="../../typings/browser.d.ts" />

class SearchBoxController {
    value: string;
    
    clear() {
        this.value = "";
    }
}

export var Component: ng.IComponentOptions = {
    bindings: {
        value: "="
    },
    controller: SearchBoxController,
    controllerAs: "$c",
    template:
 `
    <input class="search-box__input" 
           ng-model="$c.value" 
           ng-model-options="{ debounce: 100 }"
           type="text" />
    <button ng-click="$c.clear()"
            type="button">
        <span class="fa fa-times"></span>
    </button>
 `
};