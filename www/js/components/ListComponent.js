var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var ListComponentController = (function () {
        function ListComponentController($scope) {
            this.$scope = $scope;
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
        ListComponentController.prototype.switchToSelectionMode = function () {
            this.selectionMode = true;
        };
        ListComponentController.ControllerName = "ListComponentController";
        ListComponentController.$inject = ["$scope"];
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
        template: "\n    <ul>\n        <li class=\"list-item\"\n            ng-repeat=\"$item in $c.items\"\n            ng-long-touch=\"$c.switchToSelectionMode()\"\n            ng-touch=\"$c.toggleSelection($item)\">            \n            <div class=\"list-item__container\">\n                <div class=\"list-item__selector placeholder\">\n                    <span class=\"fa fa-check-square-o\">&nbsp;</span>\n                </div>\n                <div class=\"list-item__selector\"\n                    ng-show=\"$c.selectionMode\">\n                    <span class=\"fa fa-check-square-o\"\n                          ng-show=\"$c.isSelected($item)\"></span>\n                    <span class=\"fa fa-square-o\" \n                          ng-show=\"!$c.isSelected($item)\"></span>\n                </div>\n                <div ng-transclude></div>\n            </div>            \n        <li>\n    </ul>",
        transclude: true
    };
});
