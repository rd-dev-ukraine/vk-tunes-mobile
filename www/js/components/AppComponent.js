var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../pub-sub/Decorators"], function (require, exports, PS) {
    "use strict";
    var AppComponentController = (function () {
        function AppComponentController($scope) {
            this.$scope = $scope;
        }
        AppComponentController.$inject = ["$scope"];
        AppComponentController = __decorate([
            PS.Subscriber
        ], AppComponentController);
        return AppComponentController;
    }());
    exports.Component = {
        controller: AppComponentController,
        template: "\n<div>\n    <h1>VK-Tunes mobile app</h1>\n    <download-info></download-info>\n    <tab>\n        <tab-item title=\"My Audio\">\n            <my-audio></my-audio>\n        </tab-item>\n        <tab-item title=\"Search Audio\">\n            <search-audio></search-audio>\n        </tab-item>\n    </tab>    \n</div>\n"
    };
});
