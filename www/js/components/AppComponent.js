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
        template: "\n<div class=\"app\">\n    <div class=\"app__content\">\n        <tab class=\"app__tab\">\n            <tab-item header-class=\"tab-button my-audio\"\n                      title=\"My Audio\">\n                <header title=\"My audio\"></header>                    \n                <download-info class=\"app__download-info\"></download-info>\n                <my-audio ></my-audio>\n            </tab-item>\n            <tab-item header-class=\"tab-button search-audio\" \n                      title=\"Search Audio\">\n                <header title=\"Search audio\"></header>                    \n                <download-info class=\"app__download-info\"></download-info>\n                <search-audio></search-audio>\n            </tab-item>\n        </tab>\n    </div>\n</div>\n"
    };
});
