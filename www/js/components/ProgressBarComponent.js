/// <reference path="../../typings/browser.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    var ProgressBarComponentController = (function () {
        function ProgressBarComponentController() {
        }
        ProgressBarComponentController.prototype.width = function () {
            return (this.progress || 0) + "%";
        };
        return ProgressBarComponentController;
    }());
    exports.Component = {
        bindings: {
            progress: "="
        },
        controller: ProgressBarComponentController,
        controllerAs: "$c",
        template: "\n    <div class=\"progress-bar\">\n        <div class=\"progress-bar__progress-indicator\"\n             ng-style=\"{ 'width': $c.width()  }\"></div>\n    </div>\n "
    };
});
