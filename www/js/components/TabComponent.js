/// <reference path="../../typings/browser.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.TabActivatedEvent = "$tabActivated";
    var TabComponentController = (function () {
        function TabComponentController() {
            this.tabs = [];
        }
        TabComponentController.prototype.addTab = function (tab) {
            this.tabs.push(tab);
            if (this.tabs.length === 1)
                this.select(tab);
        };
        TabComponentController.prototype.select = function (tab) {
            this.tabs.forEach(function (t) { return t.selected = false; });
            tab.selected = true;
            tab.$onActivate();
        };
        return TabComponentController;
    }());
    var TabItemController = (function () {
        function TabItemController($scope) {
            this.$scope = $scope;
            this.selected = false;
            this.title = "";
        }
        TabItemController.prototype.$onInit = function () {
            this.tab.addTab(this);
        };
        TabItemController.prototype.$onActivate = function () {
            this.$scope.$broadcast(exports.TabActivatedEvent, this);
        };
        TabItemController.$inject = ["$scope"];
        return TabItemController;
    }());
    exports.TabComponent = {
        transclude: true,
        controller: TabComponentController,
        template: "\n        <div class=\"tab\">\n            <ul class=\"tab-header\">\n                <li class=\"tab-header__item\"\n                    ng-repeat=\"tab in $ctrl.tabs\"\n                    ng-class=\"{ active: tab.selected }\">\n                    <a ng-click=\"$ctrl.select(tab)\"\n                       href=\"javascript:void(0)\">\n                        {{tab.title}}\n                    </a>\n                </li>\n            </ul>\n            <div class=\"tab-content\" ng-transclude></div>\n        </div>\n    "
    };
    exports.TabItemComponent = {
        bindings: {
            title: "@"
        },
        controller: TabItemController,
        require: {
            tab: "^tab"
        },
        transclude: true,
        template: "<div ng-show=\"$ctrl.selected\" ng-transclude></div>"
    };
});
