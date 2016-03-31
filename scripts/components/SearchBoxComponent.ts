/// <reference path="../../typings/browser.d.ts" />

export var Component: ng.IComponentOptions = {
    bindings: {
        value: "="
    },
    controller: function () { },
    controllerAs: "$c",
    template:
 `
    <input class="search-box__input" 
           ng-model="$c.value" 
           ng-model-options="{ debounce: 100 }"
           type="text" />
 `
    
};