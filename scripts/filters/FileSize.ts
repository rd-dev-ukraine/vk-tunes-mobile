/// <reference path="../../typings/browser.d.ts"/>

function FileSizeFilterFactory() {
    return function (value: number) {
        if (value < 1024)
            return `${value}B`;
            
        if (value < 1024 * 1024) {
            let sizeKb = (value / 1024).toFixed(2); 
            return `${sizeKb}KB`;
        }
        
        let sizeMb = (value / (1024 * 1024)).toFixed(2);
        return `${sizeMb}MB`;
    }
};


export = FileSizeFilterFactory;