module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});//      
// This weirdness, combined with the _configure function below, exists because
// we don't want a public module to import 'batfish-internal/context' directly.
// That will make any files that use it incapable of executing outside of
// Batfish (e.g. they won't work in unit tests).
var siteBasePath='';var siteOrigin=void 0;// Crude heuristic but probably ok.
function isAbsoluteUrl(url){return /^https?:/.test(url);}function prefixUrl(url){if(isAbsoluteUrl(url)){return url;}if(siteBasePath&&url.indexOf(siteBasePath)===0){return url;}if(!/^\//.test(url))url='/'+url;return siteBasePath+url;}function prefixUrlAbsolute(url){if(isAbsoluteUrl(url)){return url;}if(!siteOrigin){if(false){throw new Error('The siteOrigin property is not specified in your Batfish configuration. Unable to prefix with absolute path.');}return url;}if(!/^\//.test(url))url='/'+url;return siteOrigin+siteBasePath+url;}function isUrlPrefixed(url){return url.indexOf(siteBasePath)===0;}prefixUrl._configure=function(a,b){siteBasePath=a||'';siteOrigin=b;};exports.prefixUrl=prefixUrl;exports.prefixUrlAbsolute=prefixUrlAbsolute;exports.isUrlPrefixed=isUrlPrefixed;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var batfishContext=exports.batfishContext={selectedConfig:{siteBasePath:'',siteOrigin:'',hijackLinks:true,manageScrollRestoration:true},routes:[{path:'/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 16));}},{path:'/star/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 18));}}],notFoundRoute:{path:'',getPage:function getPage(){throw new Error('No matching route.');},is404:true}};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.routeToPrefixed=exports.routeTo=undefined;var _prefixUrl=__webpack_require__(1);var delayed=void 0;//      
var routeToHandler=void 0;function routeTo(url){if(delayed){return;}if(!routeToHandler){delayed=url;return;}routeToHandler(url);}function routeToPrefixed(url){routeTo((0,_prefixUrl.prefixUrl)(url));}// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._setRouteToHandler=function(handler){routeToHandler=handler;if(delayed){routeToHandler(delayed);delayed=null;}};// For tests.
routeTo._clearRouteToHandler=function(){routeToHandler=null;};exports.routeTo=routeTo;exports.routeToPrefixed=routeToPrefixed;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.getWindow=getWindow;//      
function getWindow(){if(typeof window==='undefined'){throw new Error('Do not call getWindow in code that will run during the static build.');}return window;}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/scroll-restorer/index.js");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.findMatchingRoute=findMatchingRoute;var _context=__webpack_require__(2);// Returns an array of regular expressions that are used to check whether a URL
// path matches one of the routes.
function createPathRegExps(routes){return routes.reduce(function(result,route){// Pages with internal routing aren't just exact matches.
var ending=route.internalRouting?'(/.+)?$':'$';// ? because the last slash is optional
result[route.path]=new RegExp('^'+route.path.replace(/\//g,'[/]')+'?'+ending);return result;},{});}//      
var pathRegExpsCache=void 0;var urlPathsCache={};// Find the route data that matches a URL path.
//
// Returns the matching route, or the not-found route if no matching route exists.
function findMatchingRoute(urlPath,options){options=options||{};var useCache=options.useCache===undefined?true:options.useCache;if(useCache&&urlPathsCache[urlPath]){return urlPathsCache[urlPath];}var pathRegExps=void 0;if(useCache&&pathRegExpsCache){pathRegExps=pathRegExpsCache;}else{pathRegExps=createPathRegExps(_context.batfishContext.routes);pathRegExpsCache=pathRegExps;}var result=void 0;for(var i=0;i<_context.batfishContext.routes.length;i++){var route=_context.batfishContext.routes[i];if(pathRegExps[route.path].test(urlPath)){result=route;break;}}if(!result){result=_context.batfishContext.notFoundRoute;}urlPathsCache[urlPath]=result;return result;}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.scrollToFragment=scrollToFragment;//      
// Check the current location for a hash, and if there is one try to scroll to it.
function scrollToFragment(){var fragment=window.location.hash;if(!fragment)return;var element=document.getElementById(fragment.replace('#',''));if(element){element.scrollIntoView();}}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.getCurrentLocation=getCurrentLocation;var _getWindow=__webpack_require__(4);function getCurrentLocation(){var win=(0,_getWindow.getWindow)();var pathname=win.location.pathname;if(!/\/$/.test(pathname))pathname+='/';return{pathname:pathname,hash:win.location.hash,search:win.location.search};}//

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=EmptyApplicationWrapper;//      
// When the user's config does not provide applicationWrapperPath, we use this.
function EmptyApplicationWrapper(props){return props.children;}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});__webpack_require__(12);var _fs=__webpack_require__(5);var _fs2=_interopRequireDefault(_fs);var _pify=__webpack_require__(13);var _pify2=_interopRequireDefault(_pify);var _mkdirp=__webpack_require__(14);var _mkdirp2=_interopRequireDefault(_mkdirp);var _path=__webpack_require__(15);var _path2=_interopRequireDefault(_path);var _context=__webpack_require__(2);var _renderInlineJsScripts=__webpack_require__(20);var _renderInlineJsScripts2=_interopRequireDefault(_renderInlineJsScripts);var _renderHtmlPage=__webpack_require__(22);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// Statically render pages as HTML.
//
// Returned Promise resolves when all HTML pages have been rendered and written.
//      
// **WARNING**
// This file gets compiled by Webpack before it is executed.
// So when it is executed, the __dirname will be {outputDirectory}/assets/.
// For any other fs activity, this file location must be taken into acconut.
function staticRenderPages(batfishConfig,assets,manifestJs,cssUrl){var inlineJsScripts=(0,_renderInlineJsScripts2.default)(batfishConfig.inlineJs);// Load the full stylesheet lazily, after DOMContentLoaded. The page will
// still render quickly because it will have its own CSS injected inline.
var css='';if(cssUrl){if(batfishConfig.staticHtmlInlineDeferCss){var loadCssJs='document.addEventListener(\'DOMContentLoaded\',function(){var s=document.createElement(\'link\');s.rel=\'stylesheet\';s.href=\''+cssUrl+'\';document.head.insertBefore(s, document.getElementById(\'loadCss\'));});';css='<script id="loadCss">'+loadCssJs+'</script>';}else{css='<link rel="stylesheet" href="'+cssUrl+'" />';}}var appendToBody=[// The Webpack manifest is inlined because it is very small.
'<script>'+manifestJs.replace(/\/\/#.*?map$/,'')+'</script>','<script src="'+assets.vendor.js+'"></script>','<script src="'+assets.app.js+'"></script>'];var writePage=function writePage(route){return(0,_renderHtmlPage.renderHtmlPage)({route:route,inlineJsScripts:inlineJsScripts,css:css,appendToBody:appendToBody,spa:batfishConfig.spa}).then(function(html){// Write every page as an index.html file in the directory corresponding
// to its route's path. Except the 404 page.
if(route.is404){return(0,_pify2.default)(_mkdirp2.default)(batfishConfig.outputDirectory).then(function(){return(0,_pify2.default)(_fs2.default.writeFile)(_path2.default.join(batfishConfig.outputDirectory,'404.html'),html);});}var baseRelativePath=route.path===batfishConfig.siteBasePath?'/':route.path.slice(batfishConfig.siteBasePath.length);var directory=_path2.default.join(batfishConfig.outputDirectory,baseRelativePath);var indexFile=_path2.default.join(directory,'index.html');return(0,_pify2.default)(_mkdirp2.default)(directory).then(function(){return(0,_pify2.default)(_fs2.default.writeFile)(indexFile,html);});});};return Promise.all(_context.batfishContext.routes.map(writePage));}exports.default=staticRenderPages;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/source-map-support/register.js");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/pify/index.js");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/mkdirp/index.js");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(17);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{}}};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(3);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var frontMatter={headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement('div',null,_react2.default.createElement('p',null,'Hippos:'),_react2.default.createElement('p',null,_react2.default.createElement('img',{src:''+(0,_prefixUrl.prefixUrl)('/static/hippos.jpg'),alt:'hippos'})),_react2.default.createElement('p',null,'Hippolyte:'),_react2.default.createElement('p',null,_react2.default.createElement('img',{src:'./hippolyte.jpg',alt:'hippolyte'})),_react2.default.createElement('p',null,_react2.default.createElement('a',{href:'/star'},'Look at stars, instead!')));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(19);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{}}};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(3);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var frontMatter={headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement('div',null,_react2.default.createElement('p',null,'Stars:'),_react2.default.createElement('p',null,_react2.default.createElement('img',{src:''+(0,_prefixUrl.prefixUrl)('/star/star.jpg'),alt:'star'})),_react2.default.createElement('p',null,'Wild Star:'),_react2.default.createElement('p',null,_react2.default.createElement('img',{src:''+(0,_prefixUrl.prefixUrl)('/static/motorcycles/wild-star.jpg'),alt:'wild star'})),_react2.default.createElement('p',null,_react2.default.createElement('a',{href:'/'},'Look at hippos, instead!')));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
var fs=__webpack_require__(5);var UglifyJs=__webpack_require__(21);function renderInlineJsScripts(inlineJsEntries){if(!inlineJsEntries){return'';}return inlineJsEntries.map(function(jsData){var code=fs.readFileSync(jsData.filename,'utf8');if(jsData.uglify!==false){var uglified=UglifyJs.minify(code);if(uglified.error)throw uglified.error;code=uglified.code;}return'<script>'+code+'</script>';}).join('\n');}module.exports=renderInlineJsScripts;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/uglify-js/tools/node.js");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.renderHtmlPage=renderHtmlPage;var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _server=__webpack_require__(23);var _server2=_interopRequireDefault(_server);var _reactHelmet=__webpack_require__(24);var _reactHelmet2=_interopRequireDefault(_reactHelmet);var _batfishApp=__webpack_require__(25);var _batfishSpaApp=__webpack_require__(37);var _staticHtmlPage=__webpack_require__(38);var _constants=__webpack_require__(39);var _constants2=_interopRequireDefault(_constants);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function renderHtmlPage(options){return options.route.getPage().then(function(pageModule){// We render the page content separately from the StaticHtmlPage, because
// the page content is what will be re-rendered when the bundled JS loads
// so it must match exactly what batfish-app.js renders (or you get React
// checksum errors). The rest of StaticHtmlPage will never be re-rendered
// by React.
var pageContent=void 0;if(options.spa){pageContent=_react2.default.createElement(_batfishSpaApp.BatfishSpaApp,{pageModule:pageModule});}else{pageContent=_react2.default.createElement(_batfishApp.BatfishApp,{startingPath:options.route.path,pageModule:pageModule});}var rawAppHtml=_server2.default.renderToString(pageContent);var helmetHead=_reactHelmet2.default.rewind();var reactDocument=_react2.default.createElement(_staticHtmlPage.StaticHtmlPage,{rawAppHtml:rawAppHtml,htmlAttributes:helmetHead.htmlAttributes.toComponent(),bodyAttributes:helmetHead.bodyAttributes.toComponent(),appendToHead:[helmetHead.title.toString(),helmetHead.base.toString(),helmetHead.meta.toString(),helmetHead.link.toString(),options.inlineJsScripts,helmetHead.script.toString(),_constants2.default.INLINE_CSS_MARKER,options.css,// This comes after the inlined and dynamically loaded CSS
// so it will override regular stylesheets
helmetHead.style.toString()],appendToBody:options.appendToBody});var html=_server2.default.renderToStaticMarkup(reactDocument);return'<!doctype html>'+html;});}//

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("react-helmet");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.BatfishApp=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _router=__webpack_require__(26);var _applicationWrapper=__webpack_require__(10);var _applicationWrapper2=_interopRequireDefault(_applicationWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var BatfishApp=exports.BatfishApp=function(_React$Component){_inherits(BatfishApp,_React$Component);function BatfishApp(){_classCallCheck(this,BatfishApp);return _possibleConstructorReturn(this,(BatfishApp.__proto__||Object.getPrototypeOf(BatfishApp)).apply(this,arguments));}_createClass(BatfishApp,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){return _react2.default.createElement(_applicationWrapper2.default,null,_react2.default.createElement(_router.Router,{startingPath:this.props.startingPath,startingComponent:this.props.pageModule.component,startingProps:this.props.pageModule.props}));}}]);return BatfishApp;}(_react2.default.Component);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.Router=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(27);var _propTypes2=_interopRequireDefault(_propTypes);var _linkHijacker=__webpack_require__(32);var _linkHijacker2=_interopRequireDefault(_linkHijacker);var _scrollRestorer=__webpack_require__(6);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _linkToLocation=__webpack_require__(33);var _linkToLocation2=_interopRequireDefault(_linkToLocation);var _querySelectorContainsNode=__webpack_require__(34);var _querySelectorContainsNode2=_interopRequireDefault(_querySelectorContainsNode);var _context=__webpack_require__(2);var _routeTo=__webpack_require__(3);var _prefixUrl=__webpack_require__(1);var _findMatchingRoute=__webpack_require__(7);var _scrollToFragment=__webpack_require__(8);var _getWindow=__webpack_require__(4);var _changePage=__webpack_require__(35);var _getCurrentLocation=__webpack_require__(9);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var _batfishContext$selec=_context.batfishContext.selectedConfig,siteBasePath=_batfishContext$selec.siteBasePath,siteOrigin=_batfishContext$selec.siteOrigin,manageScrollRestoration=_batfishContext$selec.manageScrollRestoration,hijackLinks=_batfishContext$selec.hijackLinks;// See explanation for this weirdness in prefix-url.js.
// This happens outside the component lifecycle so it can be used during
// rendering of HTML.
_prefixUrl.prefixUrl._configure(siteBasePath,siteOrigin);var Router=function(_React$PureComponent){_inherits(Router,_React$PureComponent);function Router(props){_classCallCheck(this,Router);var _this=_possibleConstructorReturn(this,(Router.__proto__||Object.getPrototypeOf(Router)).call(this,props));_this.routeTo=function(input){var win=(0,_getWindow.getWindow)();var targetLocation=(0,_linkToLocation2.default)(input);if((0,_findMatchingRoute.findMatchingRoute)(targetLocation.pathname).is404){return win.location.assign(input);}(0,_changePage.changePage)(targetLocation,_this.setState.bind(_this),{pushState:true,scrollToTop:win.location.pathname!==targetLocation.pathname||!targetLocation.hash});};var location={pathname:_this.props.startingPath};if(typeof window!=='undefined'){var win=(0,_getWindow.getWindow)();location.search=win.location.search;location.hash=win.location.hash;}_this.state={path:_this.props.startingPath,PageComponent:_this.props.startingComponent,pageProps:_this.props.startingProps,location:location};return _this;}_createClass(Router,[{key:'getChildContext',value:function getChildContext(){return{location:this.state.location};}},{key:'componentDidMount',value:function componentDidMount(){var _this2=this;if(manageScrollRestoration){_scrollRestorer2.default.start({autoRestore:false});}var win=(0,_getWindow.getWindow)();if(!win.location.hash&&manageScrollRestoration){_scrollRestorer2.default.restoreScroll();}else{(0,_scrollToFragment.scrollToFragment)();}_routeTo.routeTo._setRouteToHandler(this.routeTo);win.addEventListener('popstate',function(event){event.preventDefault();(0,_changePage.changePage)({pathname:win.location.pathname,search:win.location.search,hash:win.location.hash},_this2.setState.bind(_this2));});if(hijackLinks){_linkHijacker2.default.hijack({skipFilter:function skipFilter(link){return(0,_querySelectorContainsNode2.default)('[data-batfish-no-hijack]',link);}},this.routeTo);}this.setState({location:(0,_getCurrentLocation.getCurrentLocation)()});}// Converts input to a location object.
// If it matches a route, go there dynamically and scroll to the top of the viewport.
// If it doesn't match a route, go there non-dynamically.
},{key:'render',value:function render(){var PageComponent=this.state.PageComponent;if(!PageComponent)return null;return _react2.default.createElement(PageComponent,_extends({location:this.state.location},this.state.pageProps));}}]);return Router;}(_react2.default.PureComponent);Router.childContextTypes={location:_propTypes2.default.shape({pathname:_propTypes2.default.string.isRequired,hash:_propTypes2.default.string,search:_propTypes2.default.string}).isRequired};exports.Router=Router;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(28)();
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(29);
var invariant = __webpack_require__(30);
var ReactPropTypesSecret = __webpack_require__(31);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/link-hijacker/index.js");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/link-to-location/index.js");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = function querySelectorContainsNode(selector, node) {
  var candidates = document.querySelectorAll(selector);
  var i;
  var l = candidates.length;
  for (i = 0; i < l; i++) {
    if (candidates[i] === node || candidates[i].contains(node)) {
      return true;
    }
  }
  return false;
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.changePage=changePage;var _scrollRestorer=__webpack_require__(6);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _findMatchingRoute=__webpack_require__(7);var _scrollToFragment=__webpack_require__(8);var _routeChangeListeners=__webpack_require__(36);var _getCurrentLocation=__webpack_require__(9);var _getWindow=__webpack_require__(4);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}//      
function changePage(nextLocation,setRouterState){var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};var onFinish=arguments[3];var win=(0,_getWindow.getWindow)();var matchingRoute=(0,_findMatchingRoute.findMatchingRoute)(nextLocation.pathname);var nextUrl=[nextLocation.pathname,nextLocation.hash,nextLocation.search].join('');// Call the change-start callbacks immediately, not after the page chunk
// has already been fetched.
var startChange=(0,_routeChangeListeners._invokeRouteChangeStartCallbacks)(nextLocation.pathname);return matchingRoute.getPage().then(function(pageModule){return startChange.then(function(){return pageModule;});}).then(function(pageModule){if(options.pushState){win.history.pushState({},null,nextUrl);}var nextState={path:matchingRoute.path,PageComponent:pageModule.component,pageProps:pageModule.props,location:(0,_getCurrentLocation.getCurrentLocation)()};setRouterState(nextState,function(){if(nextLocation.hash){(0,_scrollToFragment.scrollToFragment)();}else if(options.scrollToTop){win.scrollTo(0,0);}else if(_scrollRestorer2.default.getSavedScroll()){_scrollRestorer2.default.restoreScroll();}if(onFinish)onFinish();(0,_routeChangeListeners._invokeRouteChangeEndCallbacks)(nextLocation.pathname);});});}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.invokeCallbacks=invokeCallbacks;exports.addRouteChangeStartListener=addRouteChangeStartListener;exports.removeRouteChangeStartListener=removeRouteChangeStartListener;exports.addRouteChangeEndListener=addRouteChangeEndListener;exports.removeRouteChangeEndListener=removeRouteChangeEndListener;exports._invokeRouteChangeStartCallbacks=_invokeRouteChangeStartCallbacks;exports._invokeRouteChangeEndCallbacks=_invokeRouteChangeEndCallbacks;var _prefixUrl=__webpack_require__(1);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}//      
var ALL_PATHS='*';var startListeners=_defineProperty({},ALL_PATHS,[]);var endListeners=_defineProperty({},ALL_PATHS,[]);function normalizePathname(pathname){if(pathname!==ALL_PATHS&&!(0,_prefixUrl.isUrlPrefixed)(pathname)){pathname=(0,_prefixUrl.prefixUrl)(pathname);}return pathname.replace(/\/$/,'');}function addListener(pathnameOrListener,maybeListener,registry,remover){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!registry[pathname]){registry[pathname]=[];}registry[pathname].push(listener||noop);return function(){return remover(pathname,listener);};}function removeListener(pathnameOrListener,maybeListener,registry){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'||!pathnameOrListener){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!listener){registry[pathname]=[];return;}var listeners=registry[pathname];for(var i=0,l=listeners.length;i<l;i++){if(listeners[i]===listener){listeners.splice(i,1);return;}}}function invokeCallbacks(nextPathname,registery){nextPathname=normalizePathname(nextPathname);var promisesToKeep=[Promise.resolve()];if(registery[nextPathname]){registery[nextPathname].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});}registery[ALL_PATHS].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});return Promise.all(promisesToKeep);}function addRouteChangeStartListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,startListeners,removeRouteChangeStartListener);}function removeRouteChangeStartListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,startListeners);}function addRouteChangeEndListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,endListeners,removeRouteChangeEndListener);}function removeRouteChangeEndListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,endListeners);}function _invokeRouteChangeStartCallbacks(nextPathname){return invokeCallbacks(nextPathname,startListeners);}function _invokeRouteChangeEndCallbacks(nextPathname){return invokeCallbacks(nextPathname,endListeners);}function noop(){}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.BatfishSpaApp=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _applicationWrapper=__webpack_require__(10);var _applicationWrapper2=_interopRequireDefault(_applicationWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var BatfishSpaApp=exports.BatfishSpaApp=function(_React$Component){_inherits(BatfishSpaApp,_React$Component);function BatfishSpaApp(){_classCallCheck(this,BatfishSpaApp);return _possibleConstructorReturn(this,(BatfishSpaApp.__proto__||Object.getPrototypeOf(BatfishSpaApp)).apply(this,arguments));}_createClass(BatfishSpaApp,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var body=_react2.default.createElement(this.props.pageModule.component,this.props.pageModule.props);return _react2.default.createElement(_applicationWrapper2.default,null,body);}}]);return BatfishSpaApp;}(_react2.default.Component);

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.StaticHtmlPage=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
// This component is used by static-render-pages to create an HTML document.
var StaticHtmlPage=function(_React$Component){_inherits(StaticHtmlPage,_React$Component);function StaticHtmlPage(){_classCallCheck(this,StaticHtmlPage);return _possibleConstructorReturn(this,(StaticHtmlPage.__proto__||Object.getPrototypeOf(StaticHtmlPage)).apply(this,arguments));}_createClass(StaticHtmlPage,[{key:'shouldComponentUpdate',// This should never be updated by React
value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var head=null;if(this.props.appendToHead){head=_react2.default.createElement('head',{dangerouslySetInnerHTML:{__html:this.props.appendToHead.join('\n')}});}var appendToBody=null;if(this.props.appendToBody){appendToBody=_react2.default.createElement('div',{dangerouslySetInnerHTML:{__html:this.props.appendToBody.join('\n')}});}var app=_react2.default.createElement('div',{id:'batfish-content'},this.props.content);if(this.props.rawAppHtml){app=_react2.default.createElement('div',{id:'batfish-content',dangerouslySetInnerHTML:{__html:this.props.rawAppHtml}});}return _react2.default.createElement('html',_extends({lang:'en'},this.props.htmlAttributes),head,_react2.default.createElement('body',this.props.bodyAttributes,app,appendToBody));}}]);return StaticHtmlPage;}(_react2.default.Component);exports.StaticHtmlPage=StaticHtmlPage;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
module.exports=Object.freeze({INLINE_CSS_MARKER:'<!-- INLINE CSS HERE, BATFISH -->',BATFISH_CSS_BASENAME:'batfish-styles.css',STATS_BASENAME:'stats.json',DATA_DIRECTORY:'data',EVENT_ERROR:'error',EVENT_NOTIFICATION:'notification',EVENT_DONE:'done',TARGET_NODE:'node',TARGET_BROWSER:'browser',PAGE_EXT_GLOB:'{js,md}'});

/***/ })
/******/ ]);
//# sourceMappingURL=static-render-pages.js.map