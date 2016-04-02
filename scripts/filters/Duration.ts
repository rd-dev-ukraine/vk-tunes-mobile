/// <reference path="../../typings/browser.d.ts"/>

function leftPad(value: any, totalLen: number, char: string) {
    let str = `${value}`;
    
    while(str.length < totalLen) {
        str = char + str;
    }
    
    return str;
}

function DurationFilterFactory() {
    const secPerMinute = 60;
    const minPerHour = 60;
    const secPerHour = minPerHour * secPerMinute;
    
    return function (totalSeconds: number) {
        const seconds = totalSeconds % secPerMinute;
        const totalMinutes = totalSeconds - seconds;
        
        const minutes = (totalMinutes % secPerHour) / secPerMinute;
        
        return `${leftPad(minutes, 2, "0")}:${leftPad(seconds, 2, "0")}`;
    }
}

export = DurationFilterFactory;