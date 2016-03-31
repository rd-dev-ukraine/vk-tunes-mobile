/// <reference path="../../typings/browser.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.Component = {
        bindings: {
            value: "="
        },
        controller: function () { },
        controllerAs: "$c",
        template: "\n    <input class=\"search-box__input\" \n           ng-model=\"$c.value\" \n           ng-model-options=\"{ debounce: 100 }\"\n           type=\"text\" />\n "
    };
});
