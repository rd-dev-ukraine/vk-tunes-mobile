/// <reference path="../../typings/browser.d.ts" />
export var Component: ng.IComponentOptions = {
    bindings: {
        title: "@"        
    },
    controller: function() { },
    template:
`
<span class="header__title">VK-Tunes</span>
<span class="header__separator fa fa-angle-right"></span>
<span class="header__sub-title">{{$ctrl.title}}</span>    
`
};