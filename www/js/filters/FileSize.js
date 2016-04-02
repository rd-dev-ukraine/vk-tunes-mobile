/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    function FileSizeFilterFactory() {
        return function (value) {
            if (value < 1024)
                return value + "B";
            if (value < 1024 * 1024) {
                var sizeKb = (value / 1024).toFixed(2);
                return sizeKb + "KB";
            }
            var sizeMb = (value / (1024 * 1024)).toFixed(2);
            return sizeMb + "MB";
        };
    }
    ;
    return FileSizeFilterFactory;
});
