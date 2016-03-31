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
        template: "\n<div class=\"tab\">\n    <ul class=\"tab__header\">\n        <li class=\"tab-header__item {{tab.headerCss}}\"        \n            ng-repeat=\"tab in $ctrl.tabs\"\n            ng-click=\"$ctrl.select(tab)\"\n            ng-class=\"{ active: tab.selected }\">\n            {{tab.title}}            \n        </li>\n    </ul>\n    <div class=\"tab__tab-container\">\n        <div class=\"tab__content\" ng-transclude>\n        </div>\n    </div>\n</div>\n"
    };
    exports.TabItemComponent = {
        bindings: {
            title: "@",
            headerCss: "@headerClass"
        },
        controller: TabItemController,
        require: {
            tab: "^tab"
        },
        transclude: true,
        template: "\n<div ng-class=\"$ctrl.css\" ng-show=\"$ctrl.selected\" ng-transclude></div>\n"
    };
});
