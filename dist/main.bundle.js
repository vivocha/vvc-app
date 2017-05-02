webpackJsonp([1,4],{

/***/ 101:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 101;


/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(137);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_window_service__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_contact_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngrx_store__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__media_tools_media_tools_component__ = __webpack_require__(69);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AppComponent = (function () {
    function AppComponent(wref, cserv, store, translate) {
        this.wref = wref;
        this.cserv = cserv;
        this.store = store;
        this.translate = translate;
        this.lang = 'en';
        this.type = 'chat';
        this.isMobile = 'false';
        this.closeModal = false;
        this.callTimer = 0;
        this.wasFullScreen = false;
        this.window = wref.nativeWindow;
        this.appendVivochaScript();
        this.checkForVivocha();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.window.parent.postMessage('vvc-maximize-iframe', '*');
        this.bindStores();
        this.cserv.voiceStart.subscribe(function () {
            _this.startTimer();
        });
    };
    AppComponent.prototype.abandon = function () {
        this.window.parent.postMessage('vvc-close-iframe', '*');
    };
    AppComponent.prototype.acceptIncomingRequest = function (evt) {
        this.startTimer();
        this.cserv.acceptOffer(evt);
    };
    AppComponent.prototype.addLocalVideo = function () {
        this.cserv.addLocalVideo();
    };
    AppComponent.prototype.appendVivochaScript = function () {
        this.parseIframeUrl();
        var vvcScript = this.window.document.createElement('script');
        vvcScript.src = 'https://' + this.world + '.vivocha.com/a/' + this.acct + '/js/vivocha_widget.js';
        this.window.document.getElementsByTagName('head')[0].appendChild(vvcScript);
    };
    AppComponent.prototype.bindStores = function () {
        var _this = this;
        this.store.subscribe(function (state) {
            console.log('STORE', state);
            _this.widgetState = state.widgetState;
            _this.messages = state.messages;
            if (_this.wasFullScreen && _this.widgetState.video === false) {
                _this.setNormalScreen();
            }
        });
    };
    AppComponent.prototype.checkForVivocha = function () {
        var _this = this;
        if (this.window['vivocha'] && this.window['vivocha'].getContact) {
            this.cserv.init(this.window['vivocha']);
            //this.parseIframeUrl();
            this.loadCampaignSettings();
        }
        else {
            setTimeout(function () { return _this.checkForVivocha(); }, 500);
        }
    };
    AppComponent.prototype.closeContact = function () {
        this.cserv.closeContact();
        // this.window.parent.postMessage('vvc-close-iframe', '*');
        if (this.widgetState.hasSurvey) {
            this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
        }
        else {
            this.window.parent.postMessage('vvc-close-iframe', '*');
        }
    };
    AppComponent.prototype.closeOnSurvey = function () {
        this.window.parent.postMessage('vvc-close-iframe', '*');
    };
    AppComponent.prototype.denyIncomingRequest = function (media) {
        this.cserv.denyOffer(media);
    };
    AppComponent.prototype.dismissCloseModal = function () {
        this.closeModal = false;
    };
    AppComponent.prototype.download = function (url) {
        this.window.open(url, '_blank');
    };
    AppComponent.prototype.getInitialOffer = function () {
        switch (this.type) {
            case 'voice': return {
                Voice: { rx: 'required', tx: 'required', engine: 'WebRTC' },
                Sharing: { rx: 'required', tx: 'required' }
            };
            case 'video': return {
                Video: { rx: 'required', tx: 'required', engine: 'WebRTC' },
                Voice: { rx: 'required', tx: 'required', engine: 'WebRTC' },
                Sharing: { rx: 'required', tx: 'required' }
            };
            default: return { Chat: { rx: 'required', tx: 'required' }, Sharing: { rx: 'required', tx: 'required' } };
        }
    };
    AppComponent.prototype.hangup = function () {
        this.stopTimer();
        this.cserv.hangup();
    };
    AppComponent.prototype.hideDataCollectionPanel = function () {
        this.store.dispatch({ type: 'SHOW_DATA_COLLECTION', payload: false });
    };
    AppComponent.prototype.leave = function () {
        this.cserv.closeContact();
        this.window.parent.postMessage('vvc-close-iframe', '*');
    };
    AppComponent.prototype.loadCampaignSettings = function () {
        var initialOffer = this.getInitialOffer();
        this.initialConf = {
            serv_id: this.servId,
            type: this.type,
            nick: 'Marcolino',
            initial_offer: initialOffer,
            opts: {
                media: {
                    Video: 'visitor',
                    Voice: 'visitor'
                },
                survey: {
                    dataToCollect: 'schema#survey-id',
                    sendTranscript: 'ask'
                }
                /*,
                dataCollection: {
                  dataToCollect: 'schema#data-id'
                }*/
            }
        };
        this.initialConf.opts.mobile = (this.isMobile === 'true');
        if (this.initialConf.opts.dataCollection) {
            console.log('should collect data collection');
            this.cserv.collectInitialData(this.initialConf);
        }
        else {
            console.log('creating the contact');
            this.cserv.createContact(this.initialConf);
        }
    };
    AppComponent.prototype.minimize = function (state) {
        this.store.dispatch({ type: 'MINIMIZE', payload: state });
        (state) ? this.window.parent.postMessage('vvc-minimize-iframe', '*')
            : this.window.parent.postMessage('vvc-maximize-iframe', '*');
    };
    AppComponent.prototype.parseIframeUrl = function () {
        var hash = this.window.location.hash;
        console.log('iframe hash', hash);
        if (hash.indexOf(';') !== -1) {
            var hashParts = this.window.location.hash.substr(2).split(';');
            this.servId = hashParts[0];
            this.lang = hashParts[1].split('=')[1];
            this.type = hashParts[2].split('=')[1];
            this.isMobile = hashParts[3].split('=')[1];
            this.acct = hashParts[4].split('=')[1];
            this.world = hashParts[5].split('=')[1];
            console.log('iframe params', {
                servId: this.servId,
                acct: this.acct,
                world: this.world,
                lang: this.lang,
                isMobile: this.isMobile
            });
            this.translate.getTranslation(this.lang);
            this.translate.setDefaultLang('en');
            this.translate.use(this.lang);
            // this.loadCampaignSettings();
        }
    };
    AppComponent.prototype.removeLocalVideo = function () {
        this.cserv.removeLocalVideo();
    };
    AppComponent.prototype.sendAttachment = function (evt) {
        console.log('sending attachment', evt.text, evt.file);
        if (evt.file) {
            this.cserv.sendAttachment({ file: evt.file, text: evt.text });
        }
    };
    AppComponent.prototype.sendChatMessage = function (text) {
        if (text !== '') {
            this.cserv.sendText(text);
        }
    };
    AppComponent.prototype.sendDataCollection = function (obj) {
        this.cserv.sendDataCollection(obj);
    };
    AppComponent.prototype.setChatVisibility = function (visibility) {
        this.store.dispatch({ type: 'CHATVISIBILITY', payload: visibility });
    };
    AppComponent.prototype.setFullScreen = function () {
        this.wasFullScreen = true;
        this.store.dispatch({ type: 'FULLSCREEN', payload: true });
        this.window.parent.postMessage('vvc-fullscreen-on', '*');
    };
    AppComponent.prototype.setMute = function (mute) {
        this.cserv.muteAudio(mute);
    };
    AppComponent.prototype.setNormalScreen = function () {
        this.wasFullScreen = false;
        this.store.dispatch({ type: 'FULLSCREEN', payload: false });
        this.window.parent.postMessage('vvc-fullscreen-off', '*');
    };
    AppComponent.prototype.showCloseModal = function (isContactClosed) {
        if (isContactClosed) {
            if (this.widgetState.hasSurvey) {
                this.cserv.showSurvey(this.widgetState.surveyId, this.widgetState.askForTranscript);
            }
            else {
                this.window.parent.postMessage('vvc-close-iframe', '*');
            }
        }
        else {
            this.closeModal = true;
        }
    };
    AppComponent.prototype.showDataCollection = function (message) {
        this.selectedDataMessage = message;
    };
    AppComponent.prototype.startTimer = function () {
        var _this = this;
        this.stopTimer();
        this.callTimerInterval = setInterval(function () {
            _this.callTimer++;
            if (_this.mediaTools) {
                _this.mediaTools.setTime(_this.callTimer);
            }
        }, 1000);
    };
    AppComponent.prototype.stopTimer = function () {
        clearInterval(this.callTimerInterval);
        this.callTimer = 0;
    };
    AppComponent.prototype.submitInitialData = function () {
        this.cserv.sendData(this.initialConf);
    };
    AppComponent.prototype.syncDataCollection = function (obj) {
        var dc = obj.dataCollection;
        this.cserv.syncDataCollection(dc);
    };
    AppComponent.prototype.upgradeMedia = function (media) {
        var _this = this;
        var startedWith = (this.widgetState.voice) ? 'voice' : media;
        this.cserv.askForUpgrade(media, startedWith.toUpperCase()).then(function () {
            _this.startTimer();
        });
    };
    return AppComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_5__media_tools_media_tools_component__["a" /* MediaToolsComponent */]),
    __metadata("design:type", Object)
], AppComponent.prototype, "mediaTools", void 0);
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-root',
        template: __webpack_require__(195)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_window_service__["a" /* WindowRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_window_service__["a" /* WindowRef */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__core_contact_service__["a" /* VvcContactService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__core_contact_service__["a" /* VvcContactService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__ngrx_store__["c" /* Store */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ngrx_store__["c" /* Store */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */]) === "function" && _d || Object])
], AppComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_http_loader__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_core_module__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__topbar_topbar_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__chat_message_chat_message_component__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__incoming_message_incoming_message_component__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__media_tools_media_tools_component__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__chat_box_chat_box_component__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__file_uploader_file_uploader_component__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__emoji_selector_emoji_selector_component__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__autoscroll_directive__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__close_modal_close_modal_component__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__queue_queue_component__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__fullscreen_fullscreen_component__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__survey_survey_component__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__initial_data_initial_data_component__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__inc_dc_inc_dc_component__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__form_form_component__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__dc_viewer_dc_viewer_component__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__minimized_minimized_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__no_chat_no_chat_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__video_thumbs_video_thumbs_component__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__draggable_directive__ = __webpack_require__(123);
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_5__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, 'https://tevez.vivocha.com/s/widget-xl8/xl8/', '.json');
}
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_17__queue_queue_component__["a" /* QueueComponent */],
            __WEBPACK_IMPORTED_MODULE_8__topbar_topbar_component__["a" /* TopbarComponent */],
            __WEBPACK_IMPORTED_MODULE_9__chat_message_chat_message_component__["a" /* ChatMessageComponent */],
            __WEBPACK_IMPORTED_MODULE_10__incoming_message_incoming_message_component__["a" /* IncomingMessageComponent */],
            __WEBPACK_IMPORTED_MODULE_11__media_tools_media_tools_component__["a" /* MediaToolsComponent */],
            __WEBPACK_IMPORTED_MODULE_12__chat_box_chat_box_component__["a" /* ChatBoxComponent */],
            __WEBPACK_IMPORTED_MODULE_13__file_uploader_file_uploader_component__["a" /* FileUploaderComponent */],
            __WEBPACK_IMPORTED_MODULE_14__emoji_selector_emoji_selector_component__["a" /* EmojiSelectorComponent */],
            __WEBPACK_IMPORTED_MODULE_15__autoscroll_directive__["a" /* Angular2AutoScroll */],
            __WEBPACK_IMPORTED_MODULE_16__close_modal_close_modal_component__["a" /* CloseModalComponent */],
            __WEBPACK_IMPORTED_MODULE_18__fullscreen_fullscreen_component__["a" /* FullscreenComponent */],
            __WEBPACK_IMPORTED_MODULE_19__survey_survey_component__["a" /* SurveyComponent */],
            __WEBPACK_IMPORTED_MODULE_20__initial_data_initial_data_component__["a" /* InitialDataComponent */],
            __WEBPACK_IMPORTED_MODULE_21__inc_dc_inc_dc_component__["a" /* IncDcComponent */],
            __WEBPACK_IMPORTED_MODULE_22__form_form_component__["a" /* FormComponent */],
            __WEBPACK_IMPORTED_MODULE_23__dc_viewer_dc_viewer_component__["a" /* DcViewerComponent */],
            __WEBPACK_IMPORTED_MODULE_24__minimized_minimized_component__["a" /* MinimizedComponent */],
            __WEBPACK_IMPORTED_MODULE_25__no_chat_no_chat_component__["a" /* NoChatComponent */],
            __WEBPACK_IMPORTED_MODULE_26__video_thumbs_video_thumbs_component__["a" /* VideoThumbsComponent */],
            __WEBPACK_IMPORTED_MODULE_27__draggable_directive__["a" /* DraggableDirective */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* ReactiveFormsModule */],
            __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["a" /* TranslateModule */].forRoot({
                loader: {
                    provide: __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["b" /* TranslateLoader */],
                    useFactory: (createTranslateLoader),
                    deps: [__WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */]]
                }
            }),
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_6__core_core_module__["a" /* CoreModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Angular2AutoScroll; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Angular2AutoScroll = (function () {
    function Angular2AutoScroll(element) {
        this.lockYOffset = 10;
        this.observeAttributes = "false";
        this.isLocked = false;
        this.nativeElement = element.nativeElement;
    }
    Angular2AutoScroll.prototype.scrollHandler = function () {
        var scrollFromBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
        this.isLocked = scrollFromBottom > this.lockYOffset;
    };
    Angular2AutoScroll.prototype.getObserveAttributes = function () {
        return this.observeAttributes !== '' && this.observeAttributes.toLowerCase() !== 'false';
    };
    Angular2AutoScroll.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.mutationObserver = new MutationObserver(function () {
            if (!_this.isLocked) {
                _this.nativeElement.scrollTop = _this.nativeElement.scrollHeight;
            }
        });
        this.mutationObserver.observe(this.nativeElement, {
            childList: true,
            subtree: true,
            attributes: this.getObserveAttributes()
        });
    };
    Angular2AutoScroll.prototype.ngOnDestroy = function () {
        this.mutationObserver.disconnect();
    };
    return Angular2AutoScroll;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])('lock-y-offset'),
    __metadata("design:type", Object)
], Angular2AutoScroll.prototype, "lockYOffset", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])('observe-attributes'),
    __metadata("design:type", String)
], Angular2AutoScroll.prototype, "observeAttributes", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Angular2AutoScroll.prototype, "scrollHandler", null);
Angular2AutoScroll = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Directive */])({
        selector: '[angular2-auto-scroll]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* ElementRef */]) === "function" && _a || Object])
], Angular2AutoScroll);

var _a;
//# sourceMappingURL=autoscroll.directive.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatBoxComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ChatBoxComponent = (function () {
    function ChatBoxComponent() {
        this.emojiPanel = false;
        this.uploadPanel = false;
        this.textAreaRows = 1;
        this.message = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.upload = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.emoji = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    ChatBoxComponent.prototype.ngOnInit = function () {
    };
    ChatBoxComponent.prototype.closeAllPanels = function () {
        this.emojiPanel = false;
        this.uploadPanel = false;
    };
    ChatBoxComponent.prototype.sendMessage = function (textArea) {
        textArea.value = textArea.value.replace(/\n$/, '');
        if (textArea.value !== '') {
            this.message.emit(textArea.value);
            textArea.value = '';
            this.textAreaRows = 1;
        }
    };
    ChatBoxComponent.prototype.toggleEmojiTool = function () {
        this.uploadPanel = false;
        return this.emojiPanel = !this.emojiPanel;
    };
    ChatBoxComponent.prototype.toggleUploadTool = function () {
        this.emojiPanel = false;
        return this.uploadPanel = !this.uploadPanel;
    };
    ChatBoxComponent.prototype.calcRows = function (chatInput) {
        /** TODO: find a better solution **/
        var h = chatInput.scrollHeight;
        if (h < 18) {
            this.textAreaRows = 1;
        }
        if (h > 37) {
            this.textAreaRows = 2;
        }
        if (h > 57) {
            this.textAreaRows = 3;
        }
    };
    return ChatBoxComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], ChatBoxComponent.prototype, "message", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], ChatBoxComponent.prototype, "upload", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], ChatBoxComponent.prototype, "emoji", void 0);
ChatBoxComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-chat-box',
        template: __webpack_require__(196)
    }),
    __metadata("design:paramtypes", [])
], ChatBoxComponent);

//# sourceMappingURL=chat-box.component.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatMessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ChatMessageComponent = (function () {
    function ChatMessageComponent() {
        this.download = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    ChatMessageComponent.prototype.ngOnInit = function () {
    };
    ChatMessageComponent.prototype.isImage = function () {
        return (((this.message.meta && this.message.meta.mimetype) || '').toLowerCase().split('/') || [])[0] === 'image';
    };
    return ChatMessageComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], ChatMessageComponent.prototype, "message", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], ChatMessageComponent.prototype, "download", void 0);
ChatMessageComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-chat-message',
        template: __webpack_require__(197)
    }),
    __metadata("design:paramtypes", [])
], ChatMessageComponent);

//# sourceMappingURL=chat-message.component.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CloseModalComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CloseModalComponent = (function () {
    function CloseModalComponent() {
        this.close = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.cancel = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    CloseModalComponent.prototype.ngOnInit = function () {
    };
    return CloseModalComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], CloseModalComponent.prototype, "close", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], CloseModalComponent.prototype, "cancel", void 0);
CloseModalComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-close-modal',
        template: __webpack_require__(198)
    }),
    __metadata("design:paramtypes", [])
], CloseModalComponent);

//# sourceMappingURL=close-modal.component.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__window_service__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contact_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngrx_store__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_reducers__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dc_service__ = __webpack_require__(67);
/* unused harmony export reducer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoreModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var reducers = { widgetState: __WEBPACK_IMPORTED_MODULE_5__core_reducers__["a" /* widgetState */], messages: __WEBPACK_IMPORTED_MODULE_5__core_reducers__["b" /* messages */] };
var productionReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__ngrx_store__["a" /* combineReducers */])(reducers);
function reducer(state, action) {
    return productionReducer(state, action);
}
var CoreModule = (function () {
    function CoreModule() {
    }
    return CoreModule;
}());
CoreModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
            // StoreModule.provideStore({widgetState, messages})
            __WEBPACK_IMPORTED_MODULE_4__ngrx_store__["b" /* StoreModule */].provideStore(reducer)
        ],
        declarations: [],
        providers: [
            __WEBPACK_IMPORTED_MODULE_2__window_service__["a" /* WindowRef */],
            { provide: __WEBPACK_IMPORTED_MODULE_3__contact_service__["a" /* VvcContactService */], useClass: __WEBPACK_IMPORTED_MODULE_3__contact_service__["a" /* VvcContactService */] },
            { provide: __WEBPACK_IMPORTED_MODULE_6__dc_service__["a" /* VvcDataCollectionService */], useClass: __WEBPACK_IMPORTED_MODULE_6__dc_service__["a" /* VvcDataCollectionService */] }
        ]
    })
], CoreModule);

//# sourceMappingURL=core.module.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = widgetState;
/* harmony export (immutable) */ __webpack_exports__["b"] = messages;
var initialWidgetState = {
    chat: false,
    chatVisibility: true,
    closed: false,
    dataCollections: {},
    error: false,
    fullScreen: false,
    lastError: '',
    state: 'initializing',
    mediaOffering: false,
    minimized: false,
    mute: false,
    mute_in_progress: false,
    mobile: false,
    not_read: 0,
    sharing: false,
    topBarExpanded: true,
    video: false,
    voice: false
};
function extractInitialOpts(opts) {
    var newOpts = {
        canAddVideo: (opts.media && opts.media.Video && opts.media.Video === 'visitor'),
        canAddVoice: (opts.media && opts.media.Voice && opts.media.Voice === 'visitor'),
        hasSurvey: !!(opts.survey),
        surveyId: (opts.survey && opts.survey.dataToCollect),
        askForTranscript: (opts.survey && opts.survey.sendTranscript === 'ask'),
        mobile: !!(opts.mobile)
    };
    return newOpts;
}
;
function extractStateFromMedia(payload) {
    var newState = {
        chat: false,
        voice: false,
        video: false,
        video_rx: undefined,
        video_tx: undefined,
        sharing: false,
    };
    if (payload.Chat && payload.Chat['tx'] && payload.Chat['rx']) {
        newState.chat = true;
        newState.had_chat = true;
    }
    if (payload.Sharing && payload.Sharing['tx'] && payload.Sharing['rx']) {
        newState.sharing = true;
    }
    if (payload.Voice && payload.Voice['tx'] && payload.Voice['rx']) {
        if (payload.Voice['data']
            && payload.Voice['data']['tx_stream']
            && payload.Voice['data']['rx_stream']) {
            newState.voice = true;
        }
    }
    if (payload.Video && (payload.Video['tx'] || payload.Video['rx'])) {
        if (payload.Video['data'] && payload.Video['data']['rx_stream']) {
            newState.video_rx = payload.Video['data']['rx_stream'];
            newState.video = true;
        }
        if (payload.Video['data'] && payload.Video['data']['tx_stream']) {
            newState.video_tx = payload.Video['data']['tx_stream'];
            newState.video = true;
        }
    }
    return newState;
}
;
function widgetState(state, _a) {
    if (state === void 0) { state = initialWidgetState; }
    var type = _a.type, payload = _a.payload;
    console.log('------' + type + '------');
    if (type === 'MEDIA_CHANGE') {
        console.log(JSON.stringify(payload));
    }
    switch (type) {
        case 'INITIAL_DATA':
            var dcList = {};
            dcList[payload.id] = payload;
            return Object.assign({}, state, {
                state: 'waiting_data',
                initialDataFilled: false,
                hasDataCollection: true,
                selectedDataCollectionId: payload.id,
                dataCollections: Object.assign({}, state.dataCollections, dcList)
            });
        case 'ADD_DATA_COLLECTION':
            var newDc = {};
            newDc[payload.id] = payload;
            return Object.assign({}, state, {
                dataCollections: Object.assign({}, state.dataCollections, newDc)
            });
        case 'MERGE_DATA_COLLECTION':
            var dataCollectionWithValue = {};
            dataCollectionWithValue[payload.id] = payload;
            return Object.assign({}, state, {
                dataCollections: Object.assign({}, state.dataCollections, dataCollectionWithValue)
            });
        case 'INITIAL_DATA_SENT':
            return Object.assign({}, state, { state: 'queue', initialDataFilled: true });
        case 'INITIAL_OFFER':
            var initialState = extractStateFromMedia(payload.offer);
            var initialOpts = extractInitialOpts(payload.opts);
            initialState.state = 'queue';
            if (initialState.video && state.mobile) {
                initialState.fullScreen = true;
            }
            else if (!initialState.video) {
                initialState.fullScreen = false;
            }
            return Object.assign({}, state, initialState, initialOpts);
        case 'REMOTE_CAPS':
            return Object.assign({}, state, { remoteCaps: payload });
        case 'LOCAL_CAPS':
            return Object.assign({}, state, { localCaps: payload });
        case 'MEDIA_CHANGE':
            var newState = extractStateFromMedia(payload);
            if (newState.video && state.mobile) {
                newState.fullScreen = true;
            }
            else if (!newState.video) {
                newState.fullScreen = false;
            }
            return Object.assign({}, state, newState);
        case 'MEDIA_OFFERING':
            return Object.assign({}, state, { mediaOffering: payload });
        case 'JOINED':
            if (payload) {
                return Object.assign({}, state, { agent: payload, state: 'ready' });
            }
            return Object.assign({}, state, { state: 'ready' });
        case 'FULLSCREEN':
            return Object.assign({}, state, { fullScreen: payload });
        case 'MUTE':
            return Object.assign({}, state, { mute: payload });
        case 'MUTE_IN_PROGRESS':
            return Object.assign({}, state, { mute_in_progress: payload });
        case 'CHATVISIBILITY':
            return Object.assign({}, state, { chatVisibility: payload });
        case 'REDUCE_TOPBAR':
            return Object.assign({}, state, { topBarExpanded: false });
        case 'SHOW_DATA_COLLECTION':
            return Object.assign({}, state, { dataCollectionPanel: payload });
        case 'SHOW_SURVEY':
            var dataCollections = {};
            dataCollections[payload.id] = payload;
            return Object.assign({}, state, {
                showSurvey: true,
                surveyId: payload.id,
                dataCollections: Object.assign({}, state.dataCollections, dataCollections)
            });
        case 'AGENT_IS_WRITING':
            return Object.assign({}, state, { isAgentWriting: payload });
        case 'CLOSE_CONTACT':
            return Object.assign({}, state, { closed: payload });
        case 'MINIMIZE':
            return Object.assign({}, state, { minimized: payload, not_read: 0 });
        case 'INCREMENT_NOT_READ':
            var not_read = state.not_read + 1;
            return Object.assign({}, state, { not_read: not_read });
        default: return state;
    }
}
;
function messages(messageArray, _a) {
    if (messageArray === void 0) { messageArray = []; }
    var type = _a.type, payload = _a.payload;
    switch (type) {
        case 'UPDATE_MESSAGE':
            var newArray_1 = [];
            var iMessages_1 = messageArray.filter(function (m) { return m.id === payload.id; });
            iMessages_1[0].state = payload.state;
            messageArray.forEach(function (m, i) {
                if (i === iMessages_1[0].oPos) {
                    newArray_1.push(iMessages_1[0]);
                }
                if (m.id !== payload.id) {
                    newArray_1.push(m);
                }
            });
            return newArray_1;
        case 'NEW_MESSAGE':
            var isWritingMessages = messageArray.filter(function (m) { return m.state === 'iswriting'; });
            var incomingMessages = messageArray.filter(function (m) { return m.type === 'incoming-request' && m.state !== 'closed'; });
            var chatMessages = [];
            if (incomingMessages.length > 0) {
                chatMessages = messageArray.filter(function (m) { return m.state !== 'open'; }).concat(incomingMessages);
            }
            else {
                chatMessages = messageArray;
            }
            if (payload.type === 'incoming-request') {
                payload.oPos = chatMessages.length;
            }
            return chatMessages
                .filter(function (m) { return m.state !== 'iswriting'; })
                .concat(payload, isWritingMessages);
        case 'REM_MESSAGE':
            return messageArray.filter(function (m) { return m.id !== payload.id; });
        case 'REM_IS_WRITING':
            return messageArray.filter(function (m) { return m.state !== 'iswriting'; });
        default: return messageArray;
    }
}
;
//# sourceMappingURL=core.reducers.js.map

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DcViewerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DcViewerComponent = (function () {
    function DcViewerComponent() {
        this.submit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.close = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    DcViewerComponent.prototype.ngOnInit = function () {
    };
    DcViewerComponent.prototype.closeViewer = function () {
        this.dc.dataValue = this.theForm.getForm().value;
        this.close.emit({ msg: this.message, dataCollection: this.dc });
    };
    DcViewerComponent.prototype.onFormSubmit = function (formValue) {
        this.dc.dataValue = formValue;
        this.submit.emit({ msg: this.message, dataCollection: this.dc });
    };
    return DcViewerComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* ViewChild */])('theForm'),
    __metadata("design:type", Object)
], DcViewerComponent.prototype, "theForm", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], DcViewerComponent.prototype, "message", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], DcViewerComponent.prototype, "dc", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], DcViewerComponent.prototype, "submit", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], DcViewerComponent.prototype, "close", void 0);
DcViewerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-dc-viewer',
        template: __webpack_require__(199)
    }),
    __metadata("design:paramtypes", [])
], DcViewerComponent);

//# sourceMappingURL=dc-viewer.component.js.map

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraggableDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DraggableDirective = (function () {
    function DraggableDirective(element) {
        this.element = element;
    }
    DraggableDirective.prototype.ngOnInit = function () {
        this.element.nativeElement.className += ' cursor-draggable';
    };
    DraggableDirective.prototype.onMouseDown = function (event) {
        if (event.button === 2 || (this._handle !== undefined && event.target !== this._handle)) {
            return; // prevents right click drag, remove his if you don't want it
        }
        this.md = true;
        this.topStart = event.y - 40;
        this.leftStart = event.x - 40;
    };
    DraggableDirective.prototype.onMouseUp = function (event) {
        this.md = false;
    };
    DraggableDirective.prototype.onMouseMove = function (event) {
        if (this.md) {
            this.element.nativeElement.style.top = (event.clientY - 40) + 'px';
            this.element.nativeElement.style.left = (event.clientX - 40) + 'px';
        }
    };
    DraggableDirective.prototype.onMouseLeave = function (event) {
        this.md = false;
    };
    DraggableDirective.prototype.onTouchStart = function (event) {
        this.md = true;
        this.topStart = event.changedTouches[0].clientY - 40;
        this.leftStart = event.changedTouches[0].clientX - 40;
        event.stopPropagation();
    };
    DraggableDirective.prototype.onTouchEnd = function () {
        this.md = false;
    };
    DraggableDirective.prototype.onTouchMove = function (event) {
        if (this.md) {
            this.element.nativeElement.style.top = (event.changedTouches[0].clientY - 40) + 'px';
            this.element.nativeElement.style.left = (event.changedTouches[0].clientX - 40) + 'px';
        }
        event.stopPropagation();
    };
    Object.defineProperty(DraggableDirective.prototype, "vvcDraggableHandle", {
        set: function (handle) {
            this._handle = handle;
        },
        enumerable: true,
        configurable: true
    });
    return DraggableDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('mousedown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onMouseDown", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('document:mouseup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onMouseUp", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('document:mousemove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onMouseMove", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('document:mouseleave', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onMouseLeave", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('touchstart', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onTouchStart", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('document:touchend', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onTouchEnd", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* HostListener */])('document:touchmove', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DraggableDirective.prototype, "onTouchMove", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DraggableDirective.prototype, "vvcDraggableHandle", null);
DraggableDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Directive */])({
        selector: '[vvcDraggable]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* ElementRef */]) === "function" && _a || Object])
], DraggableDirective);

var _a;
//# sourceMappingURL=draggable.directive.js.map

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmojiSelectorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EmojiSelectorComponent = (function () {
    function EmojiSelectorComponent() {
        this.emojis = ['😀', '😬', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉', '😊', '🙂', '🙃', '☺️', '😋',
            '😌', '😍', '😘', '😗', '😙', '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😶',
            '😐', '😑', '😒', '🙄', '🤔', '😳', '😞', '😟', '😠', '😡', '😔', '😕', '🙁', '☹️', '😣',
            '😖', '😫', '😩', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '😓',
            '😵', '😲', '🤐', '😷', '🤒', '🤕', '😴', '💤', '💩', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖'];
        this.emoji = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    EmojiSelectorComponent.prototype.ngOnInit = function () {
    };
    EmojiSelectorComponent.prototype.addEmoji = function (em) {
        this.emoji.emit(em);
    };
    return EmojiSelectorComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], EmojiSelectorComponent.prototype, "emoji", void 0);
EmojiSelectorComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-emoji-selector',
        template: __webpack_require__(200)
    }),
    __metadata("design:paramtypes", [])
], EmojiSelectorComponent);

//# sourceMappingURL=emoji-selector.component.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FileUploaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FileUploaderComponent = (function () {
    function FileUploaderComponent() {
        this.upload = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    FileUploaderComponent.prototype.ngOnInit = function () {
    };
    FileUploaderComponent.prototype.doUpload = function (inputFileDescr) {
        if (this.uploadFile) {
            this.upload.emit({ text: inputFileDescr.value, file: this.uploadFile });
            inputFileDescr.value = '';
            this.uploadFile = undefined;
        }
    };
    FileUploaderComponent.prototype.onUploading = function (evt) {
        if (evt.srcElement.files[0]) {
            this.uploadFile = evt.srcElement.files[0];
        }
    };
    FileUploaderComponent.prototype.removeUpload = function (theForm) {
        this.uploadFile = undefined;
        theForm.reset();
    };
    return FileUploaderComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FileUploaderComponent.prototype, "upload", void 0);
FileUploaderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-file-uploader',
        template: __webpack_require__(201)
    }),
    __metadata("design:paramtypes", [])
], FileUploaderComponent);

//# sourceMappingURL=file-uploader.component.js.map

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FormComponent = (function () {
    function FormComponent(fb) {
        this.fb = fb;
        this.hasRequired = false;
        this.readMode = false;
        this.submit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    FormComponent.prototype.ngOnInit = function () {
        var controllers = {};
        for (var idx in this.dc.data) {
            var el = this.dc.data[idx];
            var validators = [];
            // validators.push(el.value || '');
            if (el.required) {
                validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].required);
                this.hasRequired = true;
            }
            if (el.type === 'email') {
                validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* Validators */].email);
            }
            controllers[el.id] = [(this.dc.dataValue && this.dc.dataValue[el.id]) || el.value || '', validators];
        }
        this.form = this.fb.group(controllers);
    };
    FormComponent.prototype.getForm = function () {
        return this.form;
    };
    FormComponent.prototype.onSubmit = function (event) {
        event.stopPropagation();
        this.submit.emit(this.form.value);
    };
    return FormComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], FormComponent.prototype, "dc", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], FormComponent.prototype, "readMode", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FormComponent.prototype, "submit", void 0);
FormComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-form',
        template: __webpack_require__(202)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormBuilder */]) === "function" && _a || Object])
], FormComponent);

var _a;
//# sourceMappingURL=form.component.js.map

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FullscreenComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FullscreenComponent = (function () {
    function FullscreenComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.hangup = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.addvideo = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.remvideo = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.minimize = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.showchat = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.mute = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.chatVisible = true;
    }
    FullscreenComponent.prototype.ngOnInit = function () {
    };
    FullscreenComponent.prototype.chatToggle = function () {
        this.chatVisible = !this.chatVisible;
        this.showchat.emit(this.chatVisible);
    };
    FullscreenComponent.prototype.trustedSrc = function (url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    return FullscreenComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"]) === "function" && _a || Object)
], FullscreenComponent.prototype, "state", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "hangup", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "addvideo", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "remvideo", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "minimize", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "showchat", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], FullscreenComponent.prototype, "mute", void 0);
FullscreenComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-fullscreen',
        template: __webpack_require__(203),
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* ChangeDetectionStrategy */].OnPush
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _b || Object])
], FullscreenComponent);

var _a, _b;
//# sourceMappingURL=fullscreen.component.js.map

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IncDcComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IncDcComponent = (function () {
    function IncDcComponent() {
        this.show = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.submit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    IncDcComponent.prototype.ngOnInit = function () {
    };
    IncDcComponent.prototype.onInlineSubmit = function (formValue) {
        this.dc.dataValue = formValue;
        this.submit.emit({ msg: this.message, dataCollection: this.dc });
    };
    return IncDcComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], IncDcComponent.prototype, "message", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], IncDcComponent.prototype, "dc", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], IncDcComponent.prototype, "show", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], IncDcComponent.prototype, "submit", void 0);
IncDcComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-inc-dc',
        template: __webpack_require__(204)
    }),
    __metadata("design:paramtypes", [])
], IncDcComponent);

//# sourceMappingURL=inc-dc.component.js.map

/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IncomingMessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IncomingMessageComponent = (function () {
    function IncomingMessageComponent() {
        this.rejectOffer = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.acceptOffer = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    IncomingMessageComponent.prototype.ngOnInit = function () {
    };
    return IncomingMessageComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], IncomingMessageComponent.prototype, "message", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], IncomingMessageComponent.prototype, "rejectOffer", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], IncomingMessageComponent.prototype, "acceptOffer", void 0);
IncomingMessageComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-incoming-message',
        template: __webpack_require__(205)
    }),
    __metadata("design:paramtypes", [])
], IncomingMessageComponent);

//# sourceMappingURL=incoming-message.component.js.map

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InitialDataComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var InitialDataComponent = (function () {
    function InitialDataComponent() {
        this.datasubmit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.abandon = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    InitialDataComponent.prototype.ngOnInit = function () {
    };
    return InitialDataComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["DataCollection"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["DataCollection"]) === "function" && _a || Object)
], InitialDataComponent.prototype, "dataCollection", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], InitialDataComponent.prototype, "datasubmit", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], InitialDataComponent.prototype, "abandon", void 0);
InitialDataComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-initial-data',
        template: __webpack_require__(206)
    }),
    __metadata("design:paramtypes", [])
], InitialDataComponent);

var _a;
//# sourceMappingURL=initial-data.component.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MinimizedComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MinimizedComponent = (function () {
    function MinimizedComponent() {
    }
    MinimizedComponent.prototype.ngOnInit = function () {
    };
    MinimizedComponent.prototype.getAvatar = function () {
        return (this.state.agent &&
            this.state.agent.avatar &&
            this.state.agent.avatar.images &&
            this.state.agent.avatar.images[0] &&
            this.state.agent.avatar.images[0].file &&
            this.state.agent.avatar.base_url) ? this.state.agent.avatar.base_url + this.state.agent.avatar.images[0].file
            : 'assets/acct-img.png';
    };
    return MinimizedComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], MinimizedComponent.prototype, "state", void 0);
MinimizedComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-minimized',
        template: __webpack_require__(208)
    }),
    __metadata("design:paramtypes", [])
], MinimizedComponent);

//# sourceMappingURL=minimized.component.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NoChatComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NoChatComponent = (function () {
    function NoChatComponent() {
    }
    NoChatComponent.prototype.ngOnInit = function () {
    };
    return NoChatComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], NoChatComponent.prototype, "state", void 0);
NoChatComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-no-chat',
        template: __webpack_require__(209)
    }),
    __metadata("design:paramtypes", [])
], NoChatComponent);

//# sourceMappingURL=no-chat.component.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueueComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QueueComponent = (function () {
    function QueueComponent() {
        this.type = '';
        this.leave = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    QueueComponent.prototype.ngOnInit = function () {
    };
    return QueueComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], QueueComponent.prototype, "type", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], QueueComponent.prototype, "leave", void 0);
QueueComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-queue',
        template: __webpack_require__(210)
    }),
    __metadata("design:paramtypes", [])
], QueueComponent);

//# sourceMappingURL=queue.component.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SurveyComponent = (function () {
    function SurveyComponent() {
        this.sent = false;
        this.close = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    SurveyComponent.prototype.ngOnInit = function () {
    };
    SurveyComponent.prototype.sendSurvey = function (formValue) {
        this.sent = true;
    };
    return SurveyComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["DataCollection"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["DataCollection"]) === "function" && _a || Object)
], SurveyComponent.prototype, "dataCollection", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], SurveyComponent.prototype, "close", void 0);
SurveyComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-survey',
        template: __webpack_require__(211)
    }),
    __metadata("design:paramtypes", [])
], SurveyComponent);

var _a;
//# sourceMappingURL=survey.component.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TopbarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TopbarComponent = (function () {
    function TopbarComponent() {
        this.close = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.minimize = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.upgrade = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    TopbarComponent.prototype.ngOnInit = function () {
    };
    TopbarComponent.prototype.askForUpgrade = function (media) {
        if (!this.state[media] && !this.state.mediaOffering) {
            this.upgrade.emit(media.toUpperCase());
        }
    };
    TopbarComponent.prototype.canStartMediaRequest = function (media) {
        switch (media) {
            case 'voice':
                return this.state.canAddVoice &&
                    this.state.localCaps &&
                    this.state.localCaps.WebRTC &&
                    this.state.localCaps.WebRTC.AudioCapture &&
                    this.state.remoteCaps &&
                    this.state.remoteCaps.WebRTC &&
                    this.state.remoteCaps.WebRTC.AudioCapture &&
                    this.state.remoteCaps.MediaAvailability &&
                    this.state.remoteCaps.MediaAvailability.Voice;
            case 'video':
                return this.state.canAddVideo &&
                    this.state.localCaps &&
                    this.state.localCaps.WebRTC &&
                    this.state.localCaps.WebRTC.VideoCapture &&
                    this.state.remoteCaps &&
                    this.state.remoteCaps.WebRTC &&
                    this.state.remoteCaps.WebRTC.VideoCapture &&
                    this.state.remoteCaps.MediaAvailability &&
                    this.state.remoteCaps.MediaAvailability.Video;
        }
    };
    TopbarComponent.prototype.getAgentName = function () {
        return (this.state.agent && this.state.agent.nick) ? this.state.agent.nick : 'nonick';
    };
    TopbarComponent.prototype.getAvatar = function () {
        return (this.state.agent &&
            this.state.agent.avatar &&
            this.state.agent.avatar.images &&
            this.state.agent.avatar.images[0] &&
            this.state.agent.avatar.images[0].file &&
            this.state.agent.avatar.base_url) ? this.state.agent.avatar.base_url + this.state.agent.avatar.images[0].file
            : 'assets/acct-img.png';
    };
    return TopbarComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"]) === "function" && _a || Object)
], TopbarComponent.prototype, "state", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], TopbarComponent.prototype, "close", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], TopbarComponent.prototype, "minimize", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], TopbarComponent.prototype, "upgrade", void 0);
TopbarComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-topbar',
        template: __webpack_require__(212),
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* ChangeDetectionStrategy */].OnPush
    }),
    __metadata("design:paramtypes", [])
], TopbarComponent);

var _a;
//# sourceMappingURL=topbar.component.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoThumbsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var VideoThumbsComponent = (function () {
    function VideoThumbsComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.maximize = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    VideoThumbsComponent.prototype.ngOnInit = function () {
    };
    VideoThumbsComponent.prototype.trustedSrc = function (url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    return VideoThumbsComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", Object)
], VideoThumbsComponent.prototype, "state", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], VideoThumbsComponent.prototype, "maximize", void 0);
VideoThumbsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-video-thumbs',
        template: __webpack_require__(213),
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* ChangeDetectionStrategy */].OnPush
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _a || Object])
], VideoThumbsComponent);

var _a;
//# sourceMappingURL=video-thumbs.component.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

/*
export type DcObjectType = 'text' | 'checkbox' | 'date' | 'email' | 'link' | 'phone' | 'nickname' | 'survey' | 'privacy';
export type DcStates = 'hidden' | 'visible';
export interface DataCollectionState {
    state: DcStates;
    dataCollection?: DataCollection;
}
export interface DataCollection {
    key: string;
    type: string;
    inline?: boolean;
    name: string;
    desc: string;
    data: Array<DcObject>;
}
export interface DcObject {
    key: string;
    controlType: string;
    name: string;
    desc: string;
    type: DcObjectType;
    value?: any;
    checked?: boolean;
    policy?: Object;
    visible?: boolean;
    editable?: boolean;
    config?: DcConfigObject;
}
export interface DcConfigObject {
    hide_from_visitor?: boolean;
    multiline?: boolean;
    required?: boolean;
    default_value?: any;
    max?: number;
    min?: number;
    customRegex?: string;
    values?: Array<DcOptValue>;
}
export interface DcOptValue {
    value: any;
    text: string;
    color?: string;
}
*/
//# sourceMappingURL=core.interfaces.js.map

/***/ }),

/***/ 195:
/***/ (function(module, exports) {

module.exports = "<div id=\"vvc-container\"\n     *ngIf=\"!widgetState?.minimized\"\n     [ngClass]=\"{'mobile':widgetState?.mobile,'fullsize':widgetState?.fullScreen, 'nochat':!widgetState?.chatVisibility && widgetState?.fullScreen}\">\n\n  <vvc-fullscreen id=\"vvc-full-enabled\"\n                  *ngIf=\"widgetState?.fullScreen\"\n                  [state]=\"widgetState\"\n                  (hangup)=\"setNormalScreen();hangup()\"\n                  (addvideo)=\"addLocalVideo()\"\n                  (remvideo)=\"removeLocalVideo()\"\n                  (minimize)=\"setNormalScreen()\"\n                  (showchat)=\"setChatVisibility($event)\"\n                  (mute)=\"setMute($event)\"></vvc-fullscreen>\n\n  <vvc-initial-data id=\"vvc-initial-data\"\n                    *ngIf=\"widgetState?.state === 'waiting_data'\"\n                    [dataCollection]=\"widgetState?.dataCollections[widgetState.selectedDataCollectionId]\"\n                    (datasubmit)=\"submitInitialData()\"\n                    (abandon)=\"abandon()\"></vvc-initial-data>\n\n  <vvc-queue id=\"vvc-queue\"\n             *ngIf=\"widgetState?.state === 'queue'\"\n             [type]=\"type\"\n             (leave)=\"leave()\"></vvc-queue>\n\n  <div id=\"vvc-widget-wrap\"\n       [ngClass]=\"{'no-chat': !widgetState?.chat && !widgetState?.had_chat}\"\n       *ngIf=\"widgetState?.state === 'ready'\">\n\n    <vvc-topbar id=\"vvc-top-bar\"\n                [ngClass]=\"{'expanded': (widgetState?.topBarExpanded && !widgetState?.video)}\"\n                [state]=\"widgetState\"\n                (close)=\"showCloseModal($event)\"\n                (minimize)=\"minimize(true)\"\n                (upgrade)=\"upgradeMedia($event)\"></vvc-topbar>\n\n    <vvc-media-tools id=\"vvc-media-tools\"\n                     *ngIf=\"widgetState?.voice && !widgetState?.fullScreen\"\n                     [state]=\"widgetState\"\n                     (hangup)=\"hangup()\"\n                     (addvideo)=\"addLocalVideo()\"\n                     (remvideo)=\"removeLocalVideo()\"\n                     (maximize)=\"setFullScreen()\"\n                     (mute)=\"setMute($event)\"></vvc-media-tools>\n\n    <vvc-no-chat id=\"vvc-no-chat\"\n                 *ngIf=\"!widgetState?.chat && !widgetState?.had_chat\"\n                 [state]=\"widgetState\"></vvc-no-chat>\n\n    <div id=\"vvc-messages\"\n         *ngIf=\"widgetState?.chat || widgetState?.had_chat\"\n         angular2-auto-scroll>\n      <div *ngFor=\"let m of messages\">\n        <vvc-chat-message *ngIf=\"m.type === 'chat'\"\n                          [message]=\"m\"\n                          (download)=\"download($event)\"></vvc-chat-message>\n        <vvc-incoming-message *ngIf=\"m.type === 'incoming-request' && m.media != 'DC'\"\n                              [message]=\"m\"\n                              (rejectOffer)=\"denyIncomingRequest($event)\"\n                              (acceptOffer)=\"acceptIncomingRequest($event)\"></vvc-incoming-message>\n        <vvc-inc-dc *ngIf=\"m.type === 'incoming-request' && m.media === 'DC'\"\n                    [message]=\"m\"\n                    [dc]=\"widgetState?.dataCollections[m.dataCollectionId]\"\n                    (show)=\"showDataCollection($event)\"\n                    (submit)=\"sendDataCollection($event)\"></vvc-inc-dc>\n      </div>\n    </div>\n\n    <vvc-chat-box id=\"vvc-chat-area\" *ngIf=\"!widgetState?.closed && widgetState?.chat\"\n                  (upload)=\"sendAttachment($event)\"\n                  (message)=\"sendChatMessage($event)\"></vvc-chat-box>\n\n    <vvc-dc-viewer id=\"vvc-dc-viewer\"\n                   *ngIf=\"selectedDataMessage\"\n                   [dc]=\"widgetState?.dataCollections[selectedDataMessage.dataCollectionId]\"\n                   [message]=\"selectedDataMessage\"\n                   (submit)=\"sendDataCollection($event);selectedDataMessage = undefined;\"\n                   (close)=\"syncDataCollection($event);selectedDataMessage = undefined;\"></vvc-dc-viewer>\n\n    <vvc-close-modal id=\"vvc-close-modal\"\n                     *ngIf=\"closeModal\"\n                     (close)=\"closeContact($event)\"\n                     (cancel)=\"dismissCloseModal()\"></vvc-close-modal>\n\n    <vvc-survey id=\"vvc-survey\"\n                *ngIf=\"widgetState?.showSurvey\"\n                [dataCollection]=\"widgetState?.dataCollections[widgetState.surveyId]\"\n                (close)=\"closeOnSurvey()\"></vvc-survey>\n\n  </div>\n\n  <vvc-video-thumbs id=\"vvc-video-thumbs\"\n                    vvcDraggable\n                    *ngIf=\"widgetState?.mobile && widgetState?.video && !widgetState?.fullScreen\"\n                    [state]=\"widgetState\"\n                    (maximize)=\"setFullScreen()\"></vvc-video-thumbs>\n</div>\n\n<vvc-minimized id=\"vvc-minimized\"\n               *ngIf=\"widgetState?.minimized\"\n               [state]=\"widgetState\"\n               (click)=\"minimize(false)\"></vvc-minimized>\n\n"

/***/ }),

/***/ 196:
/***/ (function(module, exports) {

module.exports = "<div class=\"chat-box\">\n\n  <div class=\"click-catch\"\n       *ngIf=\"uploadPanel || emojiPanel\"\n       (click)=\"closeAllPanels()\"></div>\n\n  <div class=\"chat-tools-panels\"\n       *ngIf=\"uploadPanel || emojiPanel\"\n       [ngClass]=\"{'upload-selected':uploadPanel, 'emoji-selected':emojiPanel}\">\n    <div class=\"emoji-panel panel\">\n      <vvc-emoji-selector (emoji)=\"emoji.emit($event);chatInput.value=chatInput.value + $event +' '\"></vvc-emoji-selector>\n    </div>\n    <div class=\"upload-panel panel\">\n      <vvc-file-uploader (upload)=\"upload.emit($event);toggleUploadTool();\"></vvc-file-uploader>\n    </div>\n  </div>\n\n  <textarea #chatInput\n            placeholder=\"{{ 'CHAT.TEXTAREA_PLACEHOLDER' | translate }}\"\n            (keyup.enter)=\"sendMessage(chatInput);\"\n            (keyup)=\"calcRows(chatInput)\"\n            [rows]=\"textAreaRows\"></textarea>\n\n  <div class=\"chat-tools\">\n    <div class=\"tool\"\n         [ngClass]=\"{'selected':emojiPanel}\"\n         (click)=\"toggleEmojiTool()\">\n      <i class=\"vvc-smile\"></i>\n    </div>\n    <div class=\"tool\"\n         [ngClass]=\"{'selected':uploadPanel}\"\n         (click)=\"toggleUploadTool()\">\n      <i class=\"vvc-clipboard\"></i>\n    </div>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 197:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"message.isAgent\" class=\"agent-msg\" >\n  <span class=\"msg-content\" *ngIf=\"message.state === 'iswriting'\">\n    <span class=\"bubble bubble-one\"></span>\n    <span class=\"bubble bubble-two\"></span>\n    <span class=\"bubble bubble-three\"></span>\n  </span>\n\n  <span class=\"msg-content\" *ngIf=\"message.url\">\n    <span class=\"the-image\" *ngIf=\"isImage()\"><img [src]=\"message.url\"></span>\n    <span class=\"file-type\" *ngIf=\"!isImage()\"><i class=\"vvc-doc\"></i></span>\n    <span class=\"the-file\" *ngIf=\"!isImage()\">{{message.text}}</span>\n    <span class=\"download\" (click)=\"download.emit(message.url)\">{{ 'MESSAGES.DOWNLOAD' | translate }}  <i class=\"vvc-download\"></i></span>\n    <span class=\"the-message\" *ngIf=\"isImage()\">{{message.text}}</span>\n  </span>\n\n  <span class=\"msg-content\" *ngIf=\"message.state !== 'iswriting' && !message.url\">\n    {{message.text}}\n  </span>\n\n</div>\n\n<div *ngIf=\"!message.isAgent\" class=\"customer-msg\">\n\n  <span class=\"msg-content\" *ngIf=\"message.url\">\n    <span class=\"the-image\" *ngIf=\"isImage()\"><img [src]=\"message.url\"></span>\n    <span class=\"file-type\" *ngIf=\"!isImage()\"><i class=\"vvc-doc\"></i></span>\n    <span class=\"the-file\" *ngIf=\"!isImage()\">{{message.text}}</span>\n    <span class=\"download\" (click)=\"download.emit(message.url)\">{{ 'MESSAGES.DOWNLOAD' | translate }}  <i class=\"vvc-download\"></i></span>\n    <span class=\"the-message\" *ngIf=\"isImage()\">{{message.text}}</span>\n  </span>\n\n  <span *ngIf=\"message.state === 'uploading'\">\n    <span class=\"msg-content\">\n      {{ 'MESSAGES.FILE_SENDING' | translate }}\n    </span>\n    <span class=\"file-uploading spin\"><i class=\"vvc-refresh spin\"></i></span>\n  </span>\n\n\n  <span class=\"msg-content\" *ngIf=\"message.state !== 'uploading' && !message.url\">\n    {{message.text}}\n  </span>\n</div>\n"

/***/ }),

/***/ 198:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-content\">\n  <div class=\"inner-content\">\n    <div class=\"incoming-msg\">\n      <div class=\"open\">\n        <div class=\"inc-msg-header\">\n          <div class=\"inc-type\"><i class=\"vvc-sign-out\"></i></div>\n          <div class=\"inc-header\">{{ 'CLOSEMODAL.CLOSE_MESSAGE' | translate }}</div>\n        </div>\n        <div class=\"inc-msg-content\">\n          <button (click)=\"cancel.emit()\" class=\"btn-normal\">{{ 'CLOSEMODAL.NO' | translate }}</button>\n          <button (click)=\"close.emit()\" class=\"btn-primary\">{{ 'CLOSEMODAL.YES' | translate }}</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ 199:
/***/ (function(module, exports) {

module.exports = "<span class=\"back-anchor\"\n      (click)=\"closeViewer()\">\n  <i class=\"vvc-arrow-left\"></i>\n</span>\n\n<vvc-form [dc]=\"dc\" #theForm\n          [readMode]=\"message.state === 'closed'\"\n          (submit)=\"onFormSubmit($event)\"></vvc-form>\n\n"

/***/ }),

/***/ 200:
/***/ (function(module, exports) {

module.exports = "<div class=\"emoji-wrapper\">\n  <div class=\"emoji-content\">\n    <!--\n    😀 😬 😁 😂 😃 😄 😅 😆 😇 😉 😊 🙂 🙃 ☺️ 😋 😌 😍 😘 😗 😙 😚 😜 😝 😛 🤑 🤓 😎 🤗 😏 😶 😐 😑 😒 🙄 🤔 😳 😞 😟 😠 😡 😔 😕 🙁 ☹️ 😣 😖 😫 😩 😤 😮 😱 😨 😰 😯 😦 😧 😢 😥 😪 😓 😭 😵 😲 🤐 😷 🤒 🤕 😴 💤 💩 😈 👿 👹 👺 💀 👻 👽 🤖 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🙌 👏 👋 👍 👊 ✊ ✌️ 👌 ✋ 💪 🙏 ☝️ 👆 👇 👈 👉 🖕 🤘 🖖 ✍️ 💅 👄 👅 👂 👃 👁 👀 👤 🗣 👶 👦 👧 👨 👩 👱 👴 👵 👲 👳 👮 👷 💂 🕵 🎅 👼 👸 👰 🚶 🏃 💃 👯 👫 👬 👭 🙇 💁 🙅 🙆 🙋 🙎 🙍 💇 💆 💑 👩‍❤️‍👩 👨‍❤️‍👨 💏 👩‍❤️‍💋‍👩 👨‍❤️‍💋‍👨 👪 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 👨‍👩‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👚 👕 👖 👔 👗 👙 👘 💄 💋 👣 👠 👡 👢 👞 👟 👒 🎩 ⛑ 🎓 👑 🎒 👝 👛 👜 💼 👓 🕶 💍 🌂\n    -->\n    <span *ngFor=\"let em of emojis\"\n          (click)=\"addEmoji(em)\"\n          class=\"emoji\">{{em}} </span>\n  </div>\n</div>\n"

/***/ }),

/***/ 201:
/***/ (function(module, exports) {

module.exports = "<div class=\"upload-descr\">\n  <i class=\"vvc-pic\"></i> <input #fileDescr type=\"text\" placeholder=\"{{ 'TOOLS.UPLOADER.FILE_DESCRIPTION' | translate }}\" />\n</div>\n<div class=\"upload-file\">\n  <div class=\"file-containter\">\n    <i class=\"vvc-remove\"\n       *ngIf=\"uploadFile\"\n       (click)=\"removeUpload(formUploader)\"></i> <div class=\"file-name\">{{uploadFile?.name || ('TOOLS.UPLOADER.SELECT_PLACEHOLDER' | translate)}}</div>\n  </div>\n  <label for=\"theFile\" class=\"btn-primary\">{{ 'TOOLS.UPLOADER.BROWSE' | translate }}</label>\n</div>\n<div class=\"file-size\">{{ 'TOOLS.UPLOADER.MAX_FILESIZE' | translate }}</div>\n<div class=\"submit-area\">\n  <button class=\"btn-primary\"\n          [disabled]=\"!uploadFile\"\n          (click)=\"doUpload(fileDescr)\">\n    <i class=\"vvc-check\"></i> {{'TOOLS.UPLOADER.SEND' | translate }}\n  </button>\n</div>\n<form id=\"formUploader\" #formUploader enctype=\"multipart/form-data\" onsubmit=\"return false;\">\n  <input type=\"file\" id=\"theFile\" name=\"theFile\" class=\"inputfile\" (change)=\"onUploading($event)\">\n</form>"

/***/ }),

/***/ 202:
/***/ (function(module, exports) {

module.exports = "<div class=\"vvc-form\">\n\n  <div class=\"form-title\" *ngIf=\"dc.dataTitle\">{{ dc.dataTitle | translate }}</div>\n  <div class=\"form-descr\" *ngIf=\"dc.dataDescr\">{{ dc.dataDescr | translate }}</div>\n  <div class=\"form-required-legend\" *ngIf=\"hasRequired\">{{ 'DC.REQUIRED_LEGEND' | translate }}</div>\n\n  <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit($event)\">\n    <div *ngFor=\"let elem of dc.data\">\n\n      <div class=\"vvc-input\"\n           [ngClass]=\"{'error' : form.get(elem.id).errors && form.get(elem.id).touched}\"\n           *ngIf=\"elem.type === 'text' || elem.type === 'email'\">\n        <label>{{ elem.name | translate }}<span *ngIf=\"elem.required\" class=\"required\"> *</span></label>\n        <input type=\"{{elem.type}}\"\n               *ngIf=\"!readMode\"\n               [formControlName]=\"elem.id\"\n               placeholder=\"{{ elem.placeholder | translate }}\">\n        <div *ngIf=\"readMode\">\n          {{ dc.dataValue[elem.id] || '-' }}\n        </div>\n        <p *ngIf=\"form.get(elem.id).touched && !readMode\">\n          <span *ngIf=\"form.get(elem.id).hasError('required')\">{{ 'DC.REQUIRED_ERR' | translate }}</span>\n          <span *ngIf=\"form.get(elem.id).hasError('email')\">{{ 'DC.EMAIL_ERR' | translate }}</span>\n        </p>\n      </div>\n\n      <div *ngIf=\"elem.type === 'rating-bar'\">\n        <div>{{ elem.name | translate }}</div>\n        <div class=\"vvc-bar-rating\">\n          <input type=\"radio\" id=\"star5\" [formControlName]=\"elem.id\" value=\"5\" /><label for=\"star5\"></label>\n          <input type=\"radio\" id=\"star4\" [formControlName]=\"elem.id\" value=\"4\" /><label for=\"star4\"></label>\n          <input type=\"radio\" id=\"star3\" [formControlName]=\"elem.id\" value=\"3\" /><label for=\"star3\"></label>\n          <input type=\"radio\" id=\"star2\" [formControlName]=\"elem.id\" value=\"2\" /><label for=\"star2\"></label>\n          <input type=\"radio\" id=\"star1\" [formControlName]=\"elem.id\" value=\"1\" /><label for=\"star1\"></label>\n        </div>\n      </div>\n\n    </div>\n    <div *ngIf=\"!readMode\">\n      <button class=\"btn-primary\"\n              [disabled]=\"form.invalid\">{{ dc.saveButton | translate }}</button>\n    </div>\n  </form>\n</div>"

/***/ }),

/***/ 203:
/***/ (function(module, exports) {

module.exports = "<video class=\"big-video\"\n       *ngIf=\"state?.video_rx\"\n       [src]=\"trustedSrc(state.video_rx.url)\"></video>\n\n<video class=\"small-video\"\n       muted\n       *ngIf=\"state?.video_tx\"\n       [src]=\"trustedSrc(state.video_tx.url)\"></video>\n\n<div class=\"vvc-tools\">\n  <div class=\"vvc-tools-wrap\">\n    <div class=\"vvc-inner-tools video-tools\">\n      <button class=\"first-btn\"\n              *ngIf=\"state?.video_tx\"\n              (click)=\"remvideo.emit()\">\n        <i class=\"vvc-video-off\"></i> {{ 'MEDIATOOLS.VIDEO_OFF' | translate }}\n      </button>\n\n      <button class=\"first-btn\"\n              *ngIf=\"!state?.video_tx\"\n              (click)=\"addvideo.emit()\">\n        <i class=\"vvc-video\"></i> {{ 'MEDIATOOLS.VIDEO_ON' | translate }}\n      </button>\n\n      <button (click)=\"minimize.emit()\">\n        <i class=\"vvc-minimize\"></i> {{ 'MEDIATOOLS.MINIMIZE' | translate }}\n      </button>\n\n      <button *ngIf=\"!state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(true)\">\n        <i class=\"vvc-unmute\"></i> {{ 'MEDIATOOLS.MUTE' | translate }}\n      </button>\n\n      <button *ngIf=\"state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(false)\">\n        <i class=\"vvc-mute\"></i> {{ 'MEDIATOOLS.MUTE' | translate }}\n      </button>\n\n      <button class=\"hangup\" (click)=\"hangup.emit()\">\n        <i class=\"vvc-hangup\"></i> {{ 'MEDIATOOLS.HANGUP' | translate }}</button>\n    </div>\n  </div>\n</div>\n<div class=\"chat-toggle\" (click)=\"chatToggle()\">\n  <i class=\"vvc-chat\"></i>\n  <div class=\"chat-label\" *ngIf=\"!chatVisible\">{{ 'MEDIATOOLS.CHAT_SHOW' | translate }}</div>\n  <div class=\"chat-label\" *ngIf=\"chatVisible\">{{ 'MEDIATOOLS.CHAT_HIDE' | translate }}</div>\n</div>"

/***/ }),

/***/ 204:
/***/ (function(module, exports) {

module.exports = "<div class=\"incoming-msg\">\n  <div class=\"dc\">\n    <div class=\"inc-msg-header\">\n      <div class=\"inc-type\"><i class=\"vvc-doc\"></i></div>\n      <div class=\"inc-header\">{{ 'DC.INCOMING_HEAD' | translate }}</div>\n    </div>\n\n    <div class=\"inc-msg-content\" *ngIf=\"dc.mode === 'block'\">\n      {{ 'DC.ASK_FOR_COMPILE' | translate }}<br>\n      <span class=\"dc-name\">{{ dc.dataTitle | translate }}</span>\n    </div>\n\n    <div class=\"inc-msg-content form\" *ngIf=\"dc.mode === 'inline'\">\n      <vvc-form [dc]=\"dc\"\n                [readMode]=\"message.state === 'closed'\"\n                (submit)=\"onInlineSubmit($event)\"></vvc-form>\n    </div>\n\n    <div class=\"inc-msg-content\" *ngIf=\"dc.mode === 'block'\">\n      <button class=\"btn-primary\"\n              *ngIf=\"message.state === 'open'\"\n              (click)=\"show.emit(message)\">\n        <i class=\"vvc-pencil\"></i> {{ 'DC.COMPILE' | translate }}\n      </button>\n\n      <button class=\"btn-primary\"\n              *ngIf=\"message.state === 'closed'\"\n              (click)=\"show.emit(message)\">\n              <i class=\"vvc-check\"></i> {{ 'DC.VIEW' | translate }}\n      </button>\n    </div>\n\n  </div>\n</div>"

/***/ }),

/***/ 205:
/***/ (function(module, exports) {

module.exports = "<div class=\"incoming-msg\">\n\n  <div class=\"open\" *ngIf=\"message.state==='open'\">\n    <div class=\"inc-msg-header\">\n      <div class=\"inc-type\">\n        <i *ngIf=\"message.media === 'VOICE'\" class=\"vvc-phone\"></i>\n        <i *ngIf=\"message.media === 'VIDEO'\" class=\"vvc-video\"></i>\n      </div>\n      <div class=\"inc-header\">{{ message.text | translate }}</div>\n    </div>\n    <div class=\"inc-msg-content\">\n      <button class=\"btn-normal\" (click)=\"rejectOffer.emit(message.media)\">\n        <i class=\"vvc-close\"></i> {{ 'MESSAGES.DECLINE' | translate }}\n      </button>\n      <button class=\"btn-primary\"\n              *ngIf=\"message.media === 'VIDEO'\"\n              (click)=\"acceptOffer.emit('voice-only')\">\n        <i class=\"vvc-phone\"></i> {{ 'MESSAGES.VOICE_ONLY' | translate }}\n      </button>\n      <button class=\"btn-primary\" (click)=\"acceptOffer.emit('video-full')\">\n        <i class=\"vvc-check\"></i> {{ 'MESSAGES.ACCEPT' | translate }}\n      </button>\n    </div>\n  </div>\n\n  <div class=\"loading\" *ngIf=\"message.state==='loading'\">\n   <div class=\"inc-type\">\n     <i *ngIf=\"message.media === 'VOICE'\" class=\"vvc-phone\"></i>\n     <i *ngIf=\"message.media === 'VIDEO'\" class=\"vvc-video\"></i>\n   </div>\n   <div class=\"loading-wrapper\">\n     <div class=\"loader\"></div>\n   </div>\n  </div>\n\n  <div class=\"closed\"\n       *ngIf=\"message.state==='closed'\"\n       [ngClass]=\"{'rejected':message.extraClass === 'rejected', 'accepted':message.extraClass === 'accepted'}\">\n   <div class=\"inc-msg-header\">\n     <div class=\"inc-type\">\n       <i *ngIf=\"message.media === 'VOICE'\" class=\"vvc-phone\"></i>\n       <i *ngIf=\"message.media === 'VIDEO'\" class=\"vvc-video\"></i>\n       <i *ngIf=\"message.media === 'AGENTCLOSE'\" class=\"vvc-sign-out\"></i>\n       <i *ngIf=\"message.media === 'TRANSFER'\" class=\"vvc-headphones\"></i>\n     </div>\n     <div class=\"inc-header\">{{ message.text | translate }}</div>\n   </div>\n  </div>\n\n</div>"

/***/ }),

/***/ 206:
/***/ (function(module, exports) {

module.exports = "<div class=\"top-box\">\n  <div class=\"top-box-row1\">\n    <div>&nbsp;</div>\n    <div>\n      <img class=\"acct-img\" src=\"assets/acct-img.png\">\n    </div>\n    <div (click)=\"abandon.emit()\">\n      <i class=\"vvc-close\"></i>\n    </div>\n  </div>\n  <div class=\"top-box-row2\">\n    <div [innerHTML]=\"'INITIAL_DATA.WELCOME' | translate\"></div>\n  </div>\n</div>\n<div class=\"data-box\">\n  <div class=\"card vvc-form\">\n    <div class=\"card-inner\">\n      <vvc-form [dc]=\"dataCollection\"\n                (submit)=\"datasubmit.emit()\"></vvc-form>\n\n      <!--\n      <div class=\"vvc-title\">\n        Anagrafica Utente\n      </div>\n\n      <div class=\"vvc-input\">\n        <label>Nome<span class=\"required\"> *</span></label>\n        <input type=\"text\" placeholder=\"il tuo nome\">\n        <p></p>\n      </div>\n\n      <div class=\"vvc-input\">\n        <label>Cognome<span class=\"required\"> *</span></label>\n        <input type=\"text\" placeholder=\"il tuo cognome\">\n        <p></p>\n      </div>\n\n      <div class=\"vvc-input\">\n        <label>Email</label>\n        <input type=\"email\" placeholder=\"la tua email\">\n        <p></p>\n      </div>\n\n      <button class=\"btn-primary\" (click)=\"datasubmit.emit()\">Invia</button>\n      -->\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 207:
/***/ (function(module, exports) {

module.exports = "<div class=\"vvc-media-wrap\" [ngClass]=\"{'video': state?.video, 'voice': !state?.video}\">\n\n  <div class=\"vvc-video-wrap video-tools\">\n\n    <video class=\"big-video\"\n           *ngIf=\"state?.video_rx\"\n           [src]=\"trustedSrc(state.video_rx.url)\"></video>\n\n    <video class=\"small-video\"\n           muted\n           *ngIf=\"state?.video_tx\"\n           [src]=\"trustedSrc(state.video_tx.url)\"></video>\n  </div>\n\n\n  <div class=\"vvc-tools-wrap\">\n    <div class=\"vvc-inner-tools video-tools\" *ngIf=\"!state.mobile\">\n\n      <button class=\"first-btn\"\n              *ngIf=\"state?.video_tx\"\n              (click)=\"remvideo.emit()\">\n        <i class=\"vvc-video-off\"></i> {{ 'MEDIATOOLS.VIDEO_OFF' | translate }}\n      </button>\n\n      <button class=\"first-btn\"\n              *ngIf=\"!state?.video_tx\"\n              (click)=\"addvideo.emit()\">\n        <i class=\"vvc-video\"></i> {{ 'MEDIATOOLS.VIDEO_ON' | translate }}\n      </button>\n\n      <button *ngIf=\"!state?.fullScreen\"\n              (click)=\"maximize.emit()\">\n        <i class=\"vvc-expand\"></i> {{ 'MEDIATOOLS.EXPAND' | translate }}\n      </button>\n\n      <button *ngIf=\"!state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(true)\">\n        <i class=\"vvc-unmute\"></i> {{ 'MEDIATOOLS.MUTE' | translate }}\n      </button>\n\n      <button *ngIf=\"state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(false)\">\n        <i class=\"vvc-mute\"></i> {{ 'MEDIATOOLS.MUTE' | translate }}\n      </button>\n\n      <button class=\"hangup\" (click)=\"hangup.emit()\">\n        <i class=\"vvc-hangup\"></i> {{ 'MEDIATOOLS.HANGUP' | translate }}</button>\n    </div>\n\n    <div class=\"vvc-inner-tools audio-tools\">\n      <button class=\"first-btn audio\"\n              *ngIf=\"!state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(true)\">\n        <i class=\"vvc-unmute\"></i> {{ 'MEDIATOOLS.MUTE' | translate }}\n      </button>\n      <button class=\"first-btn audio\"\n              *ngIf=\"state.mute\"\n              [disabled]=\"state.mute_in_progress\"\n              (click)=\"mute.emit(false)\">\n        <i class=\"vvc-mute\"></i> {{ 'MEDIATOOLS.UNMUTE' | translate }}\n      </button>\n      <div class=\"the-timer\" #theTimer>\n        00:00:00\n      </div>\n      <button class=\"hangup\" (click)=\"hangup.emit()\">\n        <i class=\"vvc-hangup\"></i> {{ 'MEDIATOOLS.HANGUP' | translate }}\n      </button>\n      <audio *ngIf=\"state.voice && state.voice_rx && !state.video_rx\"\n             [src]=\"trustedSrc(state.voice_rx.url)\"></audio>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 208:
/***/ (function(module, exports) {

module.exports = "<img class='agent-img' [src]=\"getAvatar()\">\n<div class='badge' *ngIf=\"state.not_read && state.not_read > 0\">{{ state.not_read }}</div>"

/***/ }),

/***/ 209:
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n  <div class=\"card-inner\">\n    <div class=\"avatar-place\">\n      <img class='acct-img' src=\"assets/acct-img.png\">\n    </div>\n\n    <div *ngIf=\"!state.closed\">\n      <div class=\"main-msg\" [innerHTML]=\"'NOCHAT.MAIN_MSG' | translate\"></div>\n      <div class=\"sub-msg\"  [innerHTML]=\"'NOCHAT.SUB_MSG' | translate\"></div>\n    </div>\n\n    <div *ngIf=\"state.closed\" [innerHTML]=\"'NOCHAT.END_MSG' | translate\"></div>\n\n\n  </div>\n</div>"

/***/ }),

/***/ 210:
/***/ (function(module, exports) {

module.exports = "<div id=\"vvc-queue\">\n  <div id=\"top-box\">\n    <div id=\"top-box-row1\">\n      <div>&nbsp;</div>\n      <div>\n        <img class=\"acct-img\" src=\"assets/acct-img.png\">\n      </div>\n      <div (click)=\"leave.emit()\">\n        <i class=\"vvc-close\"></i>\n      </div>\n    </div>\n    <div id=\"top-box-row2\">\n      <div [innerHTML]=\"'QUEUE.WELCOME' | translate\">\n        Welcome<br>to Vivocha’s customer service\n      </div>\n    </div>\n  </div>\n  <div id=\"middle-box\">\n    <div>\n      <div class=\"media-type\">\n        <i *ngIf=\"type === 'chat'\" class=\"vvc-chat\"></i>\n        <i *ngIf=\"type === 'voice'\" class=\"vvc-phone\"></i>\n        <i *ngIf=\"type === 'video'\" class=\"vvc-video\"></i>\n      </div>\n      <div class=\"loading-wrapper\">\n        <div class=\"loader\"></div>\n      </div>\n    </div>\n  </div>\n  <div id=\"bottom-box\">\n    <div class=\"card vvc-form\">\n      <div class=\"card-inner\">\n        <div>\n          <div [innerHTML]=\"'QUEUE.INFO' | translate\">Just a moment,<br>we are connecting you with the first available agent.</div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 211:
/***/ (function(module, exports) {

module.exports = "<div class=\"top-box\">\n  <div class=\"top-box-row1\">\n    <div>&nbsp;</div>\n    <div>\n      <img class=\"acct-img\" src=\"assets/acct-img.png\">\n    </div>\n    <div (click)=\"close.emit()\">\n      <i class=\"vvc-close\"></i>\n    </div>\n  </div>\n  <div class=\"top-box-row2\">\n    <div [innerHTML]=\"'SURVEY.WELCOME' | translate\"></div>\n  </div>\n</div>\n<div class=\"survey-box\">\n  <div class=\"card vvc-form\">\n\n    <div class=\"card-inner\" *ngIf=\"!sent\">\n      <vvc-form [dc]=\"dataCollection\"\n                (submit)=\"sendSurvey($event)\"></vvc-form>\n    </div>\n\n    <div class=\"card-inner\" *ngIf=\"sent\">\n      <div class=\"survey-feedback\">\n        <i class=\"vvc-check\"></i>\n        <div [innerHTML]=\"'SURVEY.FEEDBACK' | translate\"></div>\n      </div>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 212:
/***/ (function(module, exports) {

module.exports = "<div class=\"top-row\">\n  <div class=\"media-tools\">\n    <div *ngIf=\"!this.state.closed\">\n      <i class=\"vvc-phone\"\n         [ngClass]=\"{'disabled': this.state.voice || this.state.mediaOffering }\"\n         *ngIf=\"canStartMediaRequest('voice')\"\n         (click)=\"askForUpgrade('voice')\"></i>\n\n      <i class=\"vvc-video\"\n         [ngClass]=\"{'disabled': this.state.video || this.state.mediaOffering }\"\n         *ngIf=\"canStartMediaRequest('video')\"\n         (click)=\"askForUpgrade('video')\"></i>\n    </div>\n  </div>\n  <div class=\"avatar-place\">\n    <img class='agent-img' [src]=\"getAvatar()\">\n  </div>\n  <div class=\"secondary-tools\">\n    <i class=\"vvc-minimize\" *ngIf=\"!this.state.closed\" (click)=\"minimize.emit()\"></i>\n    <i class=\"vvc-close\" (click)=\"close.emit(this.state.closed)\"></i>\n  </div>\n</div>\n\n<div class=\"welcome-msg\">\n  <div class=\"msg-content\">\n    <span class=\"msg\" [innerHTML]=\"'TOPBAR.WELCOME' | translate\">Welcome<br>you are talking with</span><br>\n    <span class=\"agent-name\">{{ getAgentName() }}</span>\n  </div>\n</div>\n\n<div class=\"info-msg\">\n  <span class=\"agent-name\" *ngIf=\"!state.isAgentWriting\">{{ getAgentName() }}</span>\n  <span class=\"msg\" *ngIf=\"state.isAgentWriting\"><i class=\"vvc-chat\"></i> {{ 'TOPBAR.ISWRITING' | translate:{agent: getAgentName()} }}</span>\n</div>\n"

/***/ }),

/***/ 213:
/***/ (function(module, exports) {

module.exports = "<div class=\"video-container\" (click)=\"maximize.emit()\">\n  <video class=\"remote-video\"\n         *ngIf=\"state?.video_rx\"\n         [src]=\"trustedSrc(state.video_rx.url)\"></video>\n\n  <video class=\"local-video\"\n         muted\n         *ngIf=\"!state?.video_rx && state?.video_tx\"\n         [src]=\"trustedSrc(state.video_tx.url)\"></video>\n</div>\n"

/***/ }),

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(102);


/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ngrx_store__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dc_service__ = __webpack_require__(67);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VvcContactService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var VvcContactService = (function () {
    function VvcContactService(store, zone, dcserv) {
        var _this = this;
        this.store = store;
        this.zone = zone;
        this.dcserv = dcserv;
        this.isWritingTimeout = 30000;
        this.voiceStart = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        store.subscribe(function (state) {
            _this.widgetState = state.widgetState;
        });
    }
    VvcContactService.prototype.acceptOffer = function (opts) {
        var diffOffer = this.incomingOffer;
        this.callStartedWith = 'VOICE';
        if (opts === 'voice-only' && diffOffer.Video) {
            diffOffer.Video.tx = 'off';
            this.callStartedWith = 'VIDEO';
        }
        if (opts === 'video-full' && diffOffer.Video) {
            diffOffer.Video.tx = 'required'; // TODO CHECK FOR CAPS
            this.callStartedWith = 'VIDEO';
        }
        this.mergeOffer(diffOffer);
        this.dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                id: this.incomingId,
                state: 'loading'
            }
        });
    };
    VvcContactService.prototype.addLocalVideo = function () {
        var _this = this;
        this.contact.getMediaOffer().then(function (mediaOffer) {
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'required';
            }
            _this.contact.offerMedia(mediaOffer);
        });
    };
    VvcContactService.prototype.askForUpgrade = function (media, startedWith) {
        var _this = this;
        this.callStartedWith = startedWith;
        this.dispatch({
            type: 'MEDIA_OFFERING',
            payload: true
        });
        if (media === startedWith) {
            this.incomingId = new Date().getTime();
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: this.incomingId,
                    media: this.callStartedWith,
                    state: 'loading',
                    type: 'incoming-request'
                }
            });
        }
        return this.contact.getMediaOffer().then(function (offer) {
            if (media === 'VIDEO') {
                offer.Video = {
                    tx: 'required',
                    rx: 'required',
                    via: 'net',
                    engine: 'WebRTC'
                };
            }
            if (media === 'VIDEO' || media === 'VOICE') {
                offer.Voice = {
                    tx: 'required',
                    rx: 'required',
                    via: 'net',
                    engine: 'WebRTC'
                };
            }
            return _this.contact.offerMedia(offer).then(function () {
                _this.dispatch({ type: 'MEDIA_OFFERING', payload: false });
            }, function (err) {
                var reason = 'REJECTED';
                if (err === 'bad_state') {
                    reason = 'FAILED';
                }
                _this.dispatch({ type: 'MEDIA_OFFERING', payload: false });
                _this.dispatch({ type: 'REM_MESSAGE', payload: { id: _this.incomingId } });
                _this.dispatch({
                    type: 'NEW_MESSAGE',
                    payload: {
                        id: new Date().getTime(),
                        type: 'incoming-request',
                        media: _this.callStartedWith,
                        state: 'closed',
                        extraClass: 'rejected',
                        text: 'MESSAGES.REMOTE_' + _this.callStartedWith + '_' + reason
                    }
                });
            });
        });
    };
    VvcContactService.prototype.checkForTranscript = function () {
        var transcript = this.contact.contact.transcript;
        if (transcript && transcript.length > 0) {
            this.dispatch({ type: 'REDUCE_TOPBAR' });
        }
        for (var m in transcript) {
            var msg = transcript[m];
            switch (msg.type) {
                case 'text':
                    this.dispatch({ type: 'NEW_MESSAGE', payload: { text: msg.body, type: 'chat', isAgent: msg.agent } });
                    break;
                case 'attachment':
                    this.dispatch({ type: 'NEW_MESSAGE', payload: {
                            text: msg.meta.desc || msg.meta.originalName,
                            type: 'chat',
                            isAgent: msg.agent,
                            meta: msg.meta,
                            url: (msg.meta.originalUrl) ? msg.meta.originalUrl : msg.url,
                            from_nick: msg.from_nick,
                            from_id: msg.from_id
                        } });
                    break;
            }
        }
    };
    VvcContactService.prototype.clearIsWriting = function () {
        clearTimeout(this.isWritingTimer);
        this.dispatch({ type: 'REM_IS_WRITING' });
        this.dispatch({ type: 'AGENT_IS_WRITING', payload: false });
    };
    VvcContactService.prototype.closeContact = function () {
        this.contact.leave();
    };
    VvcContactService.prototype.collectInitialData = function (conf) {
        var _this = this;
        this.dcserv.loadDataCollection(conf.opts.dataCollection.dataToCollect).then(function (dc) {
            _this.dispatch({ type: 'INITIAL_DATA', payload: dc });
        });
    };
    VvcContactService.prototype.createContact = function (conf) {
        var _this = this;
        this.callStartedWith = conf.type.toUpperCase();
        this.dispatch({ type: 'INITIAL_OFFER', payload: { offer: conf.initial_offer, opts: conf.opts } });
        this.vivocha.getContact(conf).then(function (contact) {
            console.log('contact created, looking for the caps');
            contact.getLocalCapabilities().then(function (caps) {
                _this.dispatch({ type: 'LOCAL_CAPS', payload: caps });
            });
            contact.getRemoteCapabilities().then(function (caps) {
                _this.dispatch({ type: 'REMOTE_CAPS', payload: caps });
            });
            _this.contact = contact;
            _this.mapContact();
            if (conf.type !== 'chat') {
                _this.voiceStart.emit();
            }
        }, function (err) {
            console.log('Failed to create contact', err);
        });
    };
    VvcContactService.prototype.denyOffer = function (media) {
        this.mediaCallback('error', {});
        this.dispatch({
            type: 'REM_MESSAGE',
            payload: {
                id: this.incomingId
            }
        });
        this.dispatch({
            type: 'NEW_MESSAGE',
            payload: {
                id: new Date().getTime(),
                type: 'incoming-request',
                media: media,
                state: 'closed',
                extraClass: 'rejected',
                text: 'MESSAGES.' + media + '_REJECTED'
            }
        });
    };
    /*
    diffOffer(currentOffer, incomingOffer, flat?) {
        let hasAdded = false;
        let hasChanged = false;
        let hasRemoved = false;

        let diff = { added: {}, changed: {}, removed: {} };
        let flatDiff = { added: [], changed: [], removed: [] };
        for (let m in incomingOffer){
            if (currentOffer[m]){
                let changed = false;
                if (currentOffer[m].rx !== incomingOffer[m].rx) changed = true;
                if (currentOffer[m].tx !== incomingOffer[m].tx) changed = true;
                if (currentOffer[m].engine !== incomingOffer[m].engine) changed = true;
                if (currentOffer[m].via !== incomingOffer[m].via) changed = true;
                if (changed){
                    hasChanged = true;
                    diff.changed[m] = incomingOffer[m];
                    flatDiff.changed.push(m);
                }
            }
            else {
                if(incomingOffer[m].rx !== "off") {
                    hasAdded = true;
                    diff.added[m] = incomingOffer[m];
                    flatDiff.added.push(m);
                }
            }
        }
        for (let c in currentOffer){
            if (!incomingOffer[c]){
                hasRemoved = true;
                diff.removed[c] = currentOffer[c];
                flatDiff.removed.push(c);
            }
        }
        if (!hasAdded) delete diff.added;
        if (!hasChanged) delete diff.changed;
        if (!hasRemoved) delete diff.removed;
        return (flat) ? flatDiff : diff;
    }
    */
    VvcContactService.prototype.dispatch = function (action) {
        var _this = this;
        this.zone.run(function () {
            _this.store.dispatch(action);
        });
    };
    VvcContactService.prototype.dispatchConnectionMessages = function (newMedia) {
        var hasVoice = !!(newMedia['Voice'] &&
            newMedia['Voice']['data'] &&
            newMedia['Voice']['data']['tx_stream'] &&
            newMedia['Voice']['data']['rx_stream']);
        if (!this.widgetState.voice && hasVoice) {
            this.dispatch({ type: 'REM_MESSAGE', payload: { id: this.incomingId } });
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: this.callStartedWith,
                    state: 'closed',
                    extraClass: 'accepted',
                    text: 'MESSAGES.' + this.callStartedWith + '_STARTED'
                }
            });
        }
        if (this.widgetState.voice && !hasVoice) {
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: this.callStartedWith,
                    state: 'closed',
                    extraClass: 'accepted',
                    text: 'MESSAGES.' + this.callStartedWith + '_ENDED'
                }
            });
        }
    };
    VvcContactService.prototype.getUpgradeState = function (mediaObject) {
        for (var m in mediaObject) {
            mediaObject[m].rx = (mediaObject[m].rx !== 'off');
            mediaObject[m].tx = (mediaObject[m].tx !== 'off');
        }
        return mediaObject;
    };
    VvcContactService.prototype.fetchDataCollection = function (id) {
        var _this = this;
        this.dcserv.loadDataCollection(id).then(function (dc) {
            _this.dispatch({ type: 'ADD_DATA_COLLECTION', payload: dc });
            _this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: 'DC',
                    state: 'open',
                    dataCollectionId: dc.id
                    // dataCollection: dc
                }
            });
        });
    };
    VvcContactService.prototype.hangup = function () {
        var _this = this;
        this.contact.getMediaOffer().then(function (mediaOffer) {
            if (mediaOffer['Voice']) {
                mediaOffer['Voice'].tx = 'off';
                mediaOffer['Voice'].rx = 'off';
            }
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
                mediaOffer['Video'].rx = 'off';
            }
            _this.contact.offerMedia(mediaOffer);
        });
    };
    VvcContactService.prototype.init = function (vivocha) {
        this.vivocha = vivocha;
    };
    VvcContactService.prototype.isIncomingRequest = function (offer) {
        var resp = { askForConfirmation: false, offer: {}, media: '' };
        for (var i in offer) {
            switch (i) {
                case 'Voice':
                    if (!this.widgetState[i.toLowerCase()]
                        && offer[i]['tx'] !== 'off'
                        && offer[i]['rx'] !== 'off') {
                        resp.askForConfirmation = true;
                        resp.offer[i] = offer[i];
                    }
                    break;
                case 'Video':
                    if (!this.widgetState[i.toLowerCase()]
                        && (offer[i]['tx'] !== 'off' || offer[i]['rx'] !== 'off')) {
                        if (!this.widgetState['voice']) {
                            resp.askForConfirmation = true;
                        }
                        resp.offer[i] = offer[i];
                    }
                    break;
            }
        }
        if (resp.offer['Voice']) {
            resp.media = 'VOICE';
        }
        if (resp.offer['Video']) {
            resp.media = 'VIDEO';
        }
        return resp;
    };
    VvcContactService.prototype.mapContact = function () {
        var _this = this;
        console.log('mapping stuff on the contact');
        this.contact.on('action', function (action_code, args) {
            if (action_code === 'DataCollection') {
                // this.showDataCollection(args[0].id);
                _this.fetchDataCollection(args[0].id);
            }
        });
        this.contact.on('attachment', function (url, meta, fromId, fromNick, isAgent) {
            var attachment = { url: url, meta: meta, fromId: fromId, fromNick: fromNick, isAgent: isAgent };
            _this.dispatch({ type: 'NEW_MESSAGE', payload: {
                    text: meta.desc || meta.originalName,
                    type: 'chat',
                    isAgent: isAgent,
                    meta: meta,
                    url: (meta.originalUrl) ? meta.originalUrl : url,
                    from_nick: fromNick,
                    from_id: fromId
                } });
        });
        this.contact.on('capabilities', function (caps) {
            _this.dispatch({ type: 'REMOTE_CAPS', payload: caps });
        });
        this.contact.on('iswriting', function (from_id, from_nick, agent) {
            if (agent) {
                _this.setIsWriting();
            }
        });
        this.contact.on('joined', function (c) {
            if (c.user) {
                _this.onAgentJoin(c);
            }
            else {
                _this.onLocalJoin(c);
            }
        });
        this.contact.on('left', function (obj) {
            console.log('LEFT', obj);
            if (obj.channels && (obj.channels.user !== undefined) && obj.channels.user === 0) {
                _this.sendCloseMessage();
            }
        });
        this.contact.on('localcapabilities', function (caps) {
            _this.dispatch({ type: 'LOCAL_CAPS', payload: caps });
        });
        this.contact.on('localtext', function (text) {
            _this.dispatch({ type: 'NEW_MESSAGE', payload: { text: text, type: 'chat', isAgent: false } });
        });
        this.contact.on('mediachange', function (media, changed) {
            _this.dispatchConnectionMessages(media);
            _this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
        });
        this.contact.on('mediaoffer', function (offer, cb) {
            _this.onMediaOffer(offer, cb);
        });
        this.contact.on('text', function (text, from_id, from_nick, agent) {
            _this.dispatch({ type: 'REDUCE_TOPBAR' });
            _this.dispatch({ type: 'NEW_MESSAGE', payload: { text: text, type: 'chat', isAgent: agent } });
            if (_this.widgetState && _this.widgetState.minimized) {
                _this.dispatch({ type: 'INCREMENT_NOT_READ' });
            }
            _this.playAudioNotification();
            _this.clearIsWriting();
        });
        this.contact.on('transferred', function (transferred_to) {
            _this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: new Date().getTime(),
                    type: 'incoming-request',
                    media: 'TRANSFER',
                    state: 'closed',
                    extraClass: 'rejected',
                    text: 'MESSAGES.TRANSFERRED'
                }
            });
        });
    };
    VvcContactService.prototype.mergeOffer = function (diffOffer) {
        var _this = this;
        for (var m in diffOffer) {
            if (m === 'Video' && diffOffer[m].tx === 'optional') {
                diffOffer[m].tx = 'off';
            }
            diffOffer[m].rx = (diffOffer[m].rx !== 'off');
            diffOffer[m].tx = (diffOffer[m].tx !== 'off');
        }
        this.contact.mergeMedia(diffOffer).then(function (mergedMedia) {
            _this.mediaCallback(undefined, mergedMedia);
        });
    };
    VvcContactService.prototype.muteAudio = function (muted) {
        var _this = this;
        this.dispatch({ type: 'MUTE_IN_PROGRESS', payload: true });
        this.contact.getMediaEngine('WebRTC').then(function (engine) {
            if (muted) {
                engine.muteLocalAudio();
            }
            else {
                engine.unmuteLocalAudio();
            }
            _this.dispatch({ type: 'MUTE_IN_PROGRESS', payload: false });
            _this.dispatch({ type: 'MUTE', payload: muted });
        });
    };
    VvcContactService.prototype.onAgentJoin = function (join) {
        var _this = this;
        this.contact.getMedia().then(function (media) {
            var agent = { user: join.user, nick: join.nick, avatar: join.avatar };
            _this.agentInfo = agent;
            _this.dispatch({ type: 'JOINED', payload: agent });
            _this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
        });
    };
    VvcContactService.prototype.onLocalJoin = function (join) {
        var _this = this;
        if (join.reason && join.reason === 'resume') {
            this.contact.getMedia().then(function (media) {
                var agent = _this.contact.contact.agentInfo;
                _this.dispatch({ type: 'JOINED', payload: agent });
                _this.dispatch({ type: 'MEDIA_CHANGE', payload: media });
                _this.checkForTranscript();
            });
        }
    };
    VvcContactService.prototype.onMediaOffer = function (offer, cb) {
        this.mediaCallback = cb;
        var confirmation = this.isIncomingRequest(offer);
        if (confirmation.askForConfirmation) {
            this.incomingId = new Date().getTime();
            this.incomingOffer = confirmation.offer;
            this.dispatch({
                type: 'NEW_MESSAGE',
                payload: {
                    id: this.incomingId,
                    media: confirmation.media,
                    state: 'open',
                    type: 'incoming-request',
                    text: 'MESSAGES.' + confirmation.media + '_REQUEST'
                }
            });
        }
        else {
            this.mergeOffer(offer);
        }
    };
    VvcContactService.prototype.playAudioNotification = function () {
        var notif = new Audio();
        notif.src = 'assets/beep.mp3';
        notif.load();
        notif.play();
    };
    VvcContactService.prototype.removeLocalVideo = function () {
        var _this = this;
        this.contact.getMediaOffer().then(function (mediaOffer) {
            if (mediaOffer['Video']) {
                mediaOffer['Video'].tx = 'off';
            }
            _this.contact.offerMedia(mediaOffer);
        });
    };
    VvcContactService.prototype.sendAttachment = function (msg) {
        var _this = this;
        var ref = new Date().getTime();
        this.contact.attach(msg.file, msg.text).then(function () {
            _this.dispatch({ type: 'REM_MESSAGE', payload: { id: ref } });
        }, function () {
            _this.dispatch({ type: 'REM_MESSAGE', payload: { id: ref } });
            /*
            this.dispatch({ type: 'ADD_TEXT', payload: {
                text: 'CHAT.FILE_TRANSFER_FAILED',
                type: 'AGENT-INFO'
            } });
            */
        });
        this.dispatch({ type: 'NEW_MESSAGE', payload: { id: ref, state: 'uploading', type: 'chat', isAgent: false } });
    };
    VvcContactService.prototype.sendCloseMessage = function () {
        this.dispatch({
            type: 'NEW_MESSAGE',
            payload: {
                id: new Date().getTime(),
                type: 'incoming-request',
                media: 'AGENTCLOSE',
                state: 'closed',
                extraClass: 'rejected',
                text: 'MESSAGES.REMOTE_CLOSE'
            }
        });
        this.dispatch({
            type: 'CLOSE_CONTACT',
            payload: true
        });
    };
    VvcContactService.prototype.sendData = function (initialConf) {
        var _this = this;
        setTimeout(function () {
            console.log('sending data');
            _this.dispatch({ type: 'INITIAL_DATA_SENT' });
            _this.createContact(initialConf);
        }, 1000);
    };
    VvcContactService.prototype.sendDataCollection = function (obj) {
        var dc = obj.dataCollection;
        var message = obj.msg;
        this.dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
                id: message.id,
                state: 'closed'
            }
        });
        this.dispatch({
            type: 'MERGE_DATA_COLLECTION',
            payload: dc
        });
    };
    VvcContactService.prototype.sendText = function (text) {
        this.contact.sendText(text);
    };
    VvcContactService.prototype.setIsWriting = function () {
        var _this = this;
        clearTimeout(this.isWritingTimer);
        this.dispatch({ type: 'AGENT_IS_WRITING', payload: true });
        this.dispatch({ type: 'NEW_MESSAGE', payload: { type: 'chat', state: 'iswriting', isAgent: true } });
        this.isWritingTimer = setTimeout(function () {
            _this.dispatch({ type: 'REM_IS_WRITING' });
            _this.dispatch({ type: 'AGENT_IS_WRITING', payload: false });
        }, this.isWritingTimeout);
    };
    VvcContactService.prototype.showSurvey = function (surveyId, askForTranscript) {
        var _this = this;
        this.dcserv.loadSurvey(surveyId, askForTranscript).then(function (dc) {
            _this.dispatch({ type: 'SHOW_SURVEY', payload: dc });
        });
    };
    VvcContactService.prototype.syncDataCollection = function (dataCollection) {
        this.dispatch({
            type: 'MERGE_DATA_COLLECTION',
            payload: dataCollection
        });
    };
    VvcContactService.prototype.upgradeMedia = function (upgradeState) {
        var _this = this;
        this.contact.mergeMedia(this.getUpgradeState(upgradeState)).then(function (mergedMedia) {
            if (_this.mediaCallback) {
                _this.mediaCallback(null, mergedMedia);
            }
        });
    };
    return VvcContactService;
}());
VvcContactService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["c" /* Store */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ngrx_store__["c" /* Store */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* NgZone */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* NgZone */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__dc_service__["a" /* VvcDataCollectionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__dc_service__["a" /* VvcDataCollectionService */]) === "function" && _c || Object])
], VvcContactService);

var _a, _b, _c;
//# sourceMappingURL=contact.service.js.map

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_delay__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VvcDataCollectionService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VvcDataCollectionService = (function () {
    function VvcDataCollectionService() {
        this.initialDataCollection = {
            saveButton: 'DC.D1.SUBMIT',
            dataTitle: 'DC.D1.DATA_TITLE',
            dataDescr: 'DC.D1.DATA_DESCRIPTION',
            data: [
                { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH' },
                { id: 'surname', name: 'DC.D1.SURNAME', type: 'text', required: true, placeholder: 'DC.D1.SURNAME_PH' },
                { id: 'email', name: 'DC.D1.EMAIL', type: 'email', required: true, placeholder: 'DC.D1.EMAIL_PH' },
            ]
        };
        this.survey = {
            saveButton: 'SURVEY.SUBMIT',
            dataTitle: 'SURVEY.TITLE',
            data: [
                { id: 'rating', type: 'rating-bar', required: true, name: 'SURVEY.RATING' },
                { id: 'email', type: 'email', name: 'SURVEY.EMAIL', placeholder: 'SURVEY.EMAIL_PH' }
            ]
        };
        this.blockDataCollection = {
            mode: 'block',
            saveButton: 'DC.D1.SUBMIT',
            dataTitle: 'DC.D1.DATA_TITLE',
            dataDescr: 'DC.D1.DATA_DESCRIPTION',
            data: [
                { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH' },
                { id: 'surname', name: 'DC.D1.SURNAME', type: 'text', required: true, placeholder: 'DC.D1.SURNAME_PH' },
                { id: 'email', name: 'DC.D1.EMAIL', type: 'email', required: true, placeholder: 'DC.D1.EMAIL_PH' },
            ]
        };
        this.inlineDataCollection = {
            mode: 'inline',
            saveButton: 'DC.D1.SUBMIT',
            dataTitle: 'DC.D1.DATA_TITLE',
            data: [
                { id: 'name', name: 'DC.D1.NAME', type: 'text', required: true, placeholder: 'DC.D1.NAME_PH' }
            ]
        };
    }
    VvcDataCollectionService.prototype.loadDataCollection = function (dcId) {
        var dc;
        switch (dcId) {
            case 'dc#inline':
                dc = this.inlineDataCollection;
                break;
            case 'dc#block':
                dc = this.blockDataCollection;
                break;
            case 'schema#data-id':
                dc = this.initialDataCollection;
                break;
            case 'schema#survey-id':
                dc = this.survey;
                break;
        }
        dc['id'] = dcId;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(dc).delay(1000).toPromise();
    };
    VvcDataCollectionService.prototype.loadSurvey = function (dcId, askForTranscript) {
        var dc;
        dc = this.survey;
        dc['id'] = dcId;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(dc).delay(1000).toPromise();
    };
    return VvcDataCollectionService;
}());
VvcDataCollectionService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], VvcDataCollectionService);

//# sourceMappingURL=dc.service.js.map

/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WindowRef; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function _window() {
    return window;
}
var WindowRef = (function () {
    function WindowRef() {
    }
    Object.defineProperty(WindowRef.prototype, "nativeWindow", {
        get: function () {
            return _window();
        },
        enumerable: true,
        configurable: true
    });
    return WindowRef;
}());
WindowRef = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])()
], WindowRef);

//# sourceMappingURL=window.service.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MediaToolsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MediaToolsComponent = (function () {
    function MediaToolsComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.hangup = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.addvideo = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.remvideo = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.maximize = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
        this.mute = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* EventEmitter */]();
    }
    MediaToolsComponent.prototype.setTime = function (time) {
        var date = new Date(Date.UTC(1970, 8, 1, 0, 0, time));
        date.setSeconds(time);
        this.theTimer.nativeElement.innerHTML = date.toUTCString().substr(17, 8);
    };
    MediaToolsComponent.prototype.trustedSrc = function (url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    };
    return MediaToolsComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_7" /* ViewChild */])('theTimer'),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "theTimer", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__core_core_interfaces__["VvcWidgetState"]) === "function" && _a || Object)
], MediaToolsComponent.prototype, "state", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "hangup", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "addvideo", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "remvideo", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "maximize", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(),
    __metadata("design:type", Object)
], MediaToolsComponent.prototype, "mute", void 0);
MediaToolsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
        selector: 'vvc-media-tools',
        template: __webpack_require__(207),
        changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_6" /* ChangeDetectionStrategy */].OnPush
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]) === "function" && _b || Object])
], MediaToolsComponent);

var _a, _b;
//# sourceMappingURL=media-tools.component.js.map

/***/ })

},[256]);
//# sourceMappingURL=main.bundle.js.map