/// <reference path="../../typings/browser.d.ts"/>

class VkApi {
    private static validReturnUri = "https://oauth.vk.com/blank.html"
    static ServiceName = "vk-api";
    static $inject = ["$q", "$http"];

    private authroizationInfo = {
        client_id: "3201403",
        scope: "audio",
        redirect_uri: encodeURI("http://oauth.vk.com/blank.html"),
        response_type: "token",
        display: "touch"
    };

    private accessInfo: IAuthorizationInfo;

    constructor(
        private $q: ng.IQService,
        private $http: ng.IHttpService) {
    }

    private authorizationUrl() {
        var result = "https://oauth.vk.com/authorize?v=5.21";
        for (var prop in this.authroizationInfo) {
            var value = this.authroizationInfo[prop];
            result += "&" + prop + "=" + value;
        }
        return encodeURI(result);
    }

    /// Executes authorization if needded and defers access token
    private authorize(): ng.IPromise<IAuthorizationInfo> {
        var deferred = this.$q.defer();

        if (this.accessInfo) {
            deferred.resolve(this.accessInfo);
        } else {

            var authorizationWindow = window.open(this.authorizationUrl(), "_blank", "location=no");
            authorizationWindow.addEventListener("loaderror", (event: any) => deferred.reject(event.message));
            authorizationWindow.addEventListener("loadstop", (event: any) => {
                var info = this.authorizationInfoFromUrl(event.url);                    
                if (!info)
                    return;                        
                authorizationWindow.close();                    
                this.accessInfo = info;
                deferred.resolve(this.accessInfo);                    
            });
        }

        return deferred.promise;
    }
    
    authorizationInfoFromUrl(url: string): IAuthorizationInfo {
        if (!url)
            throw "Url is required.";
            
        if (url.indexOf(VkApi.validReturnUri) != 0)
            return null;
                    
        var parts = url.split('#');

        if (parts.length != 2)
            return null;

        var returnUri = parts[0];
        if (returnUri != VkApi.validReturnUri)
            return null;

        var result = /access_token=([a-zA-Z0-9]+)&/.exec(url);
        if (result.length != 2)
            return null;

        var userMatch = /user_id=([0-9]+)/.exec(url);
        if (!userMatch || userMatch.length != 2)
            return null;

        return {
            token: result[1],
            userId: parseInt(userMatch[1])
        };            
    }

    currentUser(): number {
        if (this.accessInfo)
            return this.accessInfo.userId;
        return null;
    }

    // Requests vk.com api with performing authorization if required.
    requestApi<TResponse>(method: string, request: any): ng.IPromise<TResponse> {           

        return this.authorize()
                    .then((info: IAuthorizationInfo) => {

                            request.access_token = info.token;
                            request.v = "5.21";

                            var param = this.param(request);
                            var url = "https://api.vk.com/method/" + method + "?" + param;
                            return this.$http
                                        .post(url, request)
                                        .then(r => (<ApiResponse<TResponse>> r.data).response);
                });
    }

    private param(a: any): string {
        var s = [],
            add = function (key, value) {
                // If value is a function, invoke it and return its value
                value = angular.isFunction(value) ? value() : (value == null ? "" : value);
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            };

        for (var prop in a) {
            add(prop, a[prop]);
        }
        
        return s.join("&");
    }
}
export = VkApi;