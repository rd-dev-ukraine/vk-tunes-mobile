/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    var LongClickDirectiveController = (function () {
        function LongClickDirectiveController($timeout) {
            this.$timeout = $timeout;
            this.isPressed = false;
        }
        LongClickDirectiveController.prototype.touchStart = function ($event) {
            var _this = this;
            this.isPressed = true;
            this.timeoutPromise = this.$timeout(LongClickDirectiveController.LongClickDelay);
            this.timeoutPromise.then(function () {
                if (_this.isPressed) {
                    _this.isPressed = false;
                    _this.cancelTimeout();
                    _this.executeLongClick();
                }
            });
        };
        LongClickDirectiveController.prototype.touchEnd = function ($event) {
            if (this.isPressed) {
                this.isPressed = false;
                this.cancelTimeout();
                this.executeClick();
            }
        };
        LongClickDirectiveController.prototype.touchMove = function ($event) {
            if (this.isPressed) {
                this.isPressed = false;
                this.cancelTimeout();
            }
        };
        LongClickDirectiveController.prototype.cancelTimeout = function () {
            if (this.timeoutPromise) {
                this.$timeout.cancel(this.timeoutPromise);
                this.timeoutPromise = null;
            }
        };
        LongClickDirectiveController.prototype.executeLongClick = function () {
            if (this.longTouch)
                this.longTouch();
        };
        LongClickDirectiveController.prototype.executeClick = function () {
            if (this.touch)
                this.touch();
        };
        LongClickDirectiveController.$inject = ["$timeout"];
        LongClickDirectiveController.LongClickDelay = 1000;
        return LongClickDirectiveController;
    }());
    function DirectiveFactory() {
        var directiveDefinition = {
            bindToController: true,
            controller: LongClickDirectiveController,
            controllerAs: "$c",
            scope: {
                longTouch: "&ngLongTouch",
                touch: "&ngTouch"
            },
            restrict: "A",
            link: function (scope, $element, attrs, controller) {
                $element.on("touchstart", function ($e) { return controller.touchStart($e); });
                $element.on("touchend", function ($e) { return controller.touchEnd($e); });
                $element.on("touchmove", function ($e) { return controller.touchMove($e); });
            }
        };
        return directiveDefinition;
    }
    ;
    return DirectiveFactory;
});
