/**
 * WebViewInterface class to handle communication between webView and Android/iOS.
 */
var NSWebViewinterface = (function () {
    function NSWebViewinterface() {

        /**
         * Mapping of native eventName and its handler in webView
         */
        this.eventListenerMap = {};

        /**
         * Mapping of JS Call responseId and result for iOS
         */
        this._iosResponseMap = {};

        /**
         * Counter of iOS JS Call responseId
         */
        this._iosCntResponseId = 0;
    }

    /**
     * Handles events/commands emitted by android/ios. This function is called from nativescript.
     * @param   {string}    eventName - Native event/command name
     * @param   {data}      data - Payload for the event/command
     */
    NSWebViewinterface.prototype._onNativeEvent = function (eventName, data) {
        var lstEvtListeners = this.eventListenerMap[eventName] || [];
        for (var _i = 0; _i < lstEvtListeners.length; _i++) {
            var listener = lstEvtListeners[_i];
            var retnVal = listener && listener(data);
            // if any handler return false, not executing any further handlers for that event.
            if (retnVal === false) {
                break;
            }
        }
    };

    /**
      * Handles JS function calls by android/ios. This function is called from nativescript.
      * Result value of JS function call can be promise or any other data.
      * @param   {number}    reqId - Internal communication id
      * @param   {string}    functionName - Function to be executed in webView
      * @param   {any[]}     args  
      */
    NSWebViewinterface.prototype._callJSFunction = function (reqId, functionName, args) {
        var _this = this;
        var resolvedFn = _this._getResolvedFunction(functionName);
        if (resolvedFn) {
            var retnVal = resolvedFn.apply(window, args);
            if (retnVal && retnVal.then) {
                retnVal.then(function (value) {
                    _this._sendJSCallResponse(reqId, value);
                }, function (error) {
                    _this._sendJSCallResponse(reqId, error, true);
                });
            }
            else {
                this._sendJSCallResponse(reqId, retnVal);
            }
        }
    }

    /**
     * Resolves a function, if the function to be executed is in deep object chain.
     * e.g If we want to execute a function 'parent.child.child.fn' from native app, 
     * this function will extract fn from the object chain. 
     * We can do it by using eval also, but as there is a way, why to invite unknown security risks? 
     * 
     */
    NSWebViewinterface.prototype._getResolvedFunction = function (functionName) {
        if (functionName && (functionName = functionName.trim()).length) {
            functionName = functionName.indexOf('window.') === 0 ? functionName.replace('window.', '') : functionName;
            var arrFnPath = functionName.split('.');
            var fn = window;
            for (var i = 0; i < arrFnPath.length; i++) {
                if (!fn[arrFnPath[i]]) {
                    fn = null;
                    break;
                }
                fn = fn[arrFnPath[i]];
            }
            return fn;
        }
    }

    /**
     * Returns JS Call response by emitting internal _jsCallRespone event
     */
    NSWebViewinterface.prototype._sendJSCallResponse = function (reqId, response, isError) {
        var oResponse = {
            reqId: reqId,
            response: response || null,
            isError: !!isError
        };
        this.emit('_jsCallResponse', oResponse);
    };

    /**
     * Creates temporary iFrame element to load custom url, for sending handshake message 
     * to iOS which is necessary to initiate data transfer from webView to iOS
     */
    NSWebViewinterface.prototype._createIFrame = function (src) {
        var rootElm = document.documentElement;
        var newFrameElm = document.createElement("IFRAME");
        newFrameElm.setAttribute("src", src);
        rootElm.appendChild(newFrameElm);
        return newFrameElm;
    };

    /**
     * Sends handshaking signal to iOS using custom url, for sending event payload or JS Call response.
     * As iOS do not allow to send any data from webView. Here we are sending data in two steps.
     * 1. Send handshake signal, by loading custom url in iFrame with metadata (eventName, unique responseId)
     * 2. On intercept of this request, iOS calls _getIOSResponse with the responseId to fetch the data.
     */
    NSWebViewinterface.prototype._emitEventToIOS = function (eventName, data) {
        this._iosResponseMap[++this._iosCntResponseId] = data;
        var metadata = { eventName: eventName, resId: this._iosCntResponseId };
        var url = 'js2ios:' + JSON.stringify(metadata);
        var iFrame = this._createIFrame(url);
        iFrame.parentNode.removeChild(iFrame);
    };

    /**
     * Returns data to iOS. This function is called from iOS.
     */
    NSWebViewinterface.prototype._getIOSResponse = function (resId) {
        var response = this._iosResponseMap[resId];
        delete this._iosResponseMap[resId];
        return response;
    };

    /**
     * Calls native android function to emit event and payload to android
     */
    NSWebViewinterface.prototype._emitEventToAndroid = function (eventName, data) {
        window.androidWebViewInterface.handleEventFromWebView(eventName, data);
    };

    /**
     * Registers handlers for android/ios event/command
     */
    NSWebViewinterface.prototype.on = function (eventName, callback) {
        var lstListeners = this.eventListenerMap[eventName] || (this.eventListenerMap[eventName] = []);
        lstListeners.push(callback);
    };

    /**
     * Emits event to android/ios
     */
    NSWebViewinterface.prototype.emit = function (eventName, data) {
        var strData = typeof data === 'object' ? JSON.stringify(data) : data;
        if (window.androidWebViewInterface) {
            this._emitEventToAndroid(eventName, strData);
        }
        else {
            this._emitEventToIOS(eventName, strData);
        }
    };
    return NSWebViewinterface;
})();
window.nsWebViewInterface = new NSWebViewinterface();
