/// <reference path="../../typings/browser.d.ts"/>

class LongClickDirectiveController {
    static $inject = ["$timeout"];
    static LongClickDelay = 1000;

    longTouch: Function;
    touch: Function;

    private timeoutPromise: ng.IPromise<void>;
    private isPressed = false;

    constructor(private $timeout: ng.ITimeoutService) {
    }

    touchStart($event: JQueryEventObject) {
        this.isPressed = true;
        this.timeoutPromise = this.$timeout(LongClickDirectiveController.LongClickDelay);

        this.timeoutPromise.then(() => {
            if (this.isPressed) {
                this.isPressed = false;
                this.cancelTimeout();
                this.executeLongClick();
            }
        });
    }

    touchEnd($event: JQueryEventObject) {
        if (this.isPressed) {
            this.isPressed = false;

            this.cancelTimeout();
            this.executeClick();
        }
    }

    touchMove($event: JQueryEventObject) {
        if (this.isPressed) {
            this.isPressed = false;
            this.cancelTimeout();
        }
    }

    private cancelTimeout() {
        if (this.timeoutPromise) {
            this.$timeout.cancel(this.timeoutPromise);
            this.timeoutPromise = null;
        }
    }

    private executeLongClick() {
        if (this.longTouch)
            this.longTouch();
    }

    private executeClick() {
        if (this.touch)
            this.touch();
    }
}

function DirectiveFactory() {

    let directiveDefinition: ng.IDirective = {
        bindToController: true,
        controller: LongClickDirectiveController,
        controllerAs: "$c",
        scope: {
            longTouch: "&ngLongTouch",
            touch: "&ngTouch"
        },
        restrict: "A",
        link(scope: ng.IScope, $element: ng.IAugmentedJQuery, attrs, controller: LongClickDirectiveController) {
            $element.on("touchstart", $e => controller.touchStart($e));
            $element.on("touchend", $e => controller.touchEnd($e));
            $element.on("touchmove", $e => controller.touchMove($e));
        }
    };

    return directiveDefinition;
};

export = DirectiveFactory;