/// <reference path="../../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    function leftPad(value, totalLen, char) {
        var str = "" + value;
        while (str.length < totalLen) {
            str = char + str;
        }
        return str;
    }
    function DurationFilterFactory() {
        var secPerMinute = 60;
        var minPerHour = 60;
        var secPerHour = minPerHour * secPerMinute;
        return function (totalSeconds) {
            var seconds = totalSeconds % secPerMinute;
            var totalMinutes = totalSeconds - seconds;
            var minutes = (totalMinutes % secPerHour) / secPerMinute;
            return leftPad(minutes, 2, "0") + ":" + leftPad(seconds, 2, "0");
        };
    }
    return DurationFilterFactory;
});
