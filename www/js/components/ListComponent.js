var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var ListComponentController = (function () {
        function ListComponentController($scope, $timeout) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.items = [];
            this.selectedItems = [];
            this.selectionMode = false;
        }
        ListComponentController.prototype.isSelected = function (item) {
            return (this.selectedItems || []).some(function (e) { return e === item; });
        };
        ListComponentController.prototype.toggleSelection = function (item) {
            if (!this.selectionMode)
                return;
            this.selectedItems = this.selectedItems || [];
            if (this.isSelected(item))
                this.selectedItems = this.selectedItems.filter(function (e) { return e !== item; }) || [];
            else
                this.selectedItems.push(item);
        };
        ListComponentController.prototype.beginToggleSelection = function () {
            var _this = this;
            if (this.selectionMode)
                return;
            this.selectionTogglePromise = this.$timeout(1000, true);
            this.selectionTogglePromise
                .then(function () {
                _this.selectionMode = true;
            });
        };
        ListComponentController.prototype.cancelToggleSelection = function () {
            if (this.selectionTogglePromise)
                this.$timeout.cancel(this.selectionTogglePromise);
        };
        ListComponentController.ControllerName = "ListComponentController";
        ListComponentController.$inject = ["$scope", "$timeout"];
        ListComponentController = __decorate([
            PS.Subscriber
        ], ListComponentController);
        return ListComponentController;
    }());
    exports.Component = {
        bindings: {
            items: "<",
            selectionMode: "=",
            selectedItems: "="
        },
        controller: ListComponentController,
        controllerAs: "$c",
        template: "\n    <ul >\n        <li class=\"list-item\"\n            ng-repeat=\"$item in $c.items\">\n            <div ng-mousedown=\"$c.beginToggleSelection()\" \n                 ng-mouseup=\"$c.cancelToggleSelection()\" \n                 ng-mousemove=\"$c.cancelToggleSelection()\"\n                 ng-touchstart=\"$c.beginToggleSelection()\" \n                 ng-touchend=\"$c.cancelToggleSelection()\" \n                 ng-touchmove=\"$c.cancelToggleSelection()\">\n                <div class=\"list-item__container\"\n                    ng-click=\"$c.toggleSelection($item)\">\n                    <div class=\"list-item__selector\"\n                        style=\"float: left\"\n                        ng-show=\"$c.selectionMode\">\n                        <input type=\"checkbox\"\n                            ng-checked=\"$c.isSelected($item)\" />\n                    </div>\n                    <div ng-transclude></div>\n                </div>\n            </div>\n            <hr />\n        <li>\n    </ul>",
        transclude: true
    };
});
