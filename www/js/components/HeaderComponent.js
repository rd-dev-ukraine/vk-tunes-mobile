define(["require", "exports"], function (require, exports) {
    "use strict";
    /// <reference path="../../typings/browser.d.ts" />
    exports.Component = {
        bindings: {
            title: "@"
        },
        controller: function () { },
        template: "\n<span class=\"header__title\">VK-Tunes</span>\n<span class=\"header__separator fa fa-angle-right\"></span>\n<span class=\"header__sub-title\">{{$ctrl.title}}</span>    \n"
    };
});
