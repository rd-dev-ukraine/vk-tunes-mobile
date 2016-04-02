/// <reference path="../../typings/browser.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    var SearchBoxController = (function () {
        function SearchBoxController() {
        }
        SearchBoxController.prototype.clear = function () {
            this.value = "";
        };
        return SearchBoxController;
    }());
    exports.Component = {
        bindings: {
            value: "="
        },
        controller: SearchBoxController,
        controllerAs: "$c",
        template: "\n    <input class=\"search-box__input\" \n           ng-model=\"$c.value\" \n           ng-model-options=\"{ debounce: 100 }\"\n           type=\"text\" />\n    <button ng-click=\"$c.clear()\"\n            type=\"button\">\n        <span class=\"fa fa-times\"></span>\n    </button>\n "
    };
});
