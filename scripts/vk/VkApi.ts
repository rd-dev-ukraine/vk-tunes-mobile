﻿/// <reference path="../../typings/browser.d.ts"/>

class VkApi {
    private static validReturnUri = "https://oauth.vk.com/blank.html"
    
    private authroizationInfo = {
        client_id: "3201403",
        scope: "audio",
        redirect_uri: encodeURI("http://oauth.vk.com/blank.html"),
        response_type: "token",
        display: "touch"
    };

    private accessInfo: IAuthorizationInfo;

    private authorizationUrl() {
        var result = "https://oauth.vk.com/authorize?v=5.21";
        for (var prop in this.authroizationInfo) {
            var value = this.authroizationInfo[prop];
            result += "&" + prop + "=" + value;
        }
        return encodeURI(result);
    }

    /// Executes authorization if needded and defers access token
    private authorize(): Promise<IAuthorizationInfo> {
        return new Promise<IAuthorizationInfo>((resolve, reject) => {
            if (this.accessInfo) {
                resolve(this.accessInfo);
            } else {
                var authorizationWindow = window.open(this.authorizationUrl(), "_blank", "location=no");
                authorizationWindow.addEventListener("loaderror", (event: any) => reject(event.message));
                authorizationWindow.addEventListener("loadstop", (event: any) => {
                    var info = this.authorizationInfoFromUrl(event.url);                    
                    if (!info)
                        return;                        
                    authorizationWindow.close();                    
                    this.accessInfo = info;
                    resolve(this.accessInfo);                    
                });
            }            
        });
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
    requestApi<TResponse>(method: string, request: any): Promise<TResponse> {           

        return this.authorize()
                    .then((info: IAuthorizationInfo) => {
                        
                            request.access_token = info.token;
                            request.v = "5.21";
                            var param = this.param(request);
                            var url = "https://api.vk.com/method/" + method + "?" + param;
                            
                            return fetch(url, { 
                                            method: "POST", 
                                            body: JSON.stringify(request) 
                                        })
                                       .then(response => response.json())
                                       .then((r: ApiResponse<TResponse>) => r.response);
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