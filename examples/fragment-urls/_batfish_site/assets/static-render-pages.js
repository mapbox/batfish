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
Object.defineProperty(exports,"__esModule",{value:true});var batfishContext=exports.batfishContext={selectedConfig:{siteBasePath:'',siteOrigin:'',hijackLinks:true,manageScrollRestoration:true},routes:[{path:'/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 16));}},{path:'/two/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 18));}}],notFoundRoute:{path:'',getPage:function getPage(){throw new Error('No matching route.');},is404:true}};

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.getWindow=getWindow;//      
function getWindow(){if(typeof window==='undefined'){throw new Error('Do not call getWindow in code that will run during the static build.');}return window;}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var PageShell=function(_React$Component){_inherits(PageShell,_React$Component);function PageShell(){_classCallCheck(this,PageShell);return _possibleConstructorReturn(this,(PageShell.__proto__||Object.getPrototypeOf(PageShell)).apply(this,arguments));}_createClass(PageShell,[{key:"render",value:function render(){return _react2.default.createElement("div",null,_react2.default.createElement("ul",null,_react2.default.createElement("li",null,_react2.default.createElement("a",{href:"/"},"one")),_react2.default.createElement("li",null,_react2.default.createElement("a",{href:"/two"},"two"))),this.props.children);}}]);return PageShell;}(_react2.default.Component);exports.default=PageShell;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/scroll-restorer/index.js");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.findMatchingRoute=findMatchingRoute;var _context=__webpack_require__(1);// Returns an array of regular expressions that are used to check whether a URL
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
Object.defineProperty(exports,"__esModule",{value:true});exports.getCurrentLocation=getCurrentLocation;var _getWindow=__webpack_require__(3);function getCurrentLocation(){var win=(0,_getWindow.getWindow)();var pathname=win.location.pathname;if(!/\/$/.test(pathname))pathname+='/';return{pathname:pathname,hash:win.location.hash,search:win.location.search};}//

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
Object.defineProperty(exports,"__esModule",{value:true});__webpack_require__(12);var _fs=__webpack_require__(4);var _fs2=_interopRequireDefault(_fs);var _pify=__webpack_require__(13);var _pify2=_interopRequireDefault(_pify);var _mkdirp=__webpack_require__(14);var _mkdirp2=_interopRequireDefault(_mkdirp);var _path=__webpack_require__(15);var _path2=_interopRequireDefault(_path);var _context=__webpack_require__(1);var _renderInlineJsScripts=__webpack_require__(20);var _renderInlineJsScripts2=_interopRequireDefault(_renderInlineJsScripts);var _renderHtmlPage=__webpack_require__(22);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// Statically render pages as HTML.
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
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _pageShell=__webpack_require__(5);var _pageShell2=_interopRequireDefault(_pageShell);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var One=function(_React$Component){_inherits(One,_React$Component);function One(){_classCallCheck(this,One);return _possibleConstructorReturn(this,(One.__proto__||Object.getPrototypeOf(One)).apply(this,arguments));}_createClass(One,[{key:'render',value:function render(){return _react2.default.createElement(_pageShell2.default,null,_react2.default.createElement('ul',null,_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#lorem-ipsum'},'lorem-ipsum')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#nam-rhoncus'},'nam-rhoncus')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#integer-ut'},'integer-ut')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#praesent-vel'},'praesent-vel')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#ut-posuere'},'ut-posuere')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#suspendisse-ut'},'suspendisse-ut')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#nam-vel'},'nam-vel')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#ut-venenatis'},'ut-venenatis')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#in-efficitur'},'in-efficitur')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#quisque-cursus'},'quisque-cursus'))),_react2.default.createElement('h2',{id:'lorem-ipsum'},'Lorem ipsum'),_react2.default.createElement('p',null,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum auctor erat rutrum consectetur. Ut sit amet mi pulvinar, mattis ex quis, tincidunt nunc. Mauris quis lacinia quam. Praesent congue neque dui, nec maximus diam ullamcorper vitae. Quisque odio nunc, aliquet at luctus vel, egestas eu felis. Vivamus vitae justo maximus, egestas massa quis, varius nisi. Phasellus bibendum tortor non massa bibendum, sit amet dapibus augue venenatis. In hac habitasse platea dictumst. Suspendisse accumsan, felis eu pharetra dignissim, sem ante tristique augue, ornare tristique risus ex imperdiet velit. Proin nulla neque, luctus eu arcu eget, facilisis consectetur arcu. Proin mollis sem sit amet ante imperdiet elementum. Curabitur in erat tincidunt, pharetra libero sed, vestibulum ipsum. Duis ut consequat libero, eu auctor quam. Maecenas sit amet ex nec orci iaculis pharetra. Praesent non augue metus. Ut rhoncus placerat felis.'),_react2.default.createElement('h2',{id:'nam-rhoncus'},'Nam rhoncus'),_react2.default.createElement('p',null,'Nam rhoncus metus efficitur nisi pulvinar tincidunt. Aliquam erat volutpat. Ut a elementum ipsum, ac posuere nulla. Nam lobortis ac nisl et varius. Curabitur nec commodo lacus. Proin consectetur posuere velit vel pulvinar. Nullam condimentum eleifend ante, nec egestas eros tristique id. Aliquam at ornare dui. Fusce auctor tellus pharetra suscipit volutpat. In sed enim eu quam condimentum sollicitudin non tristique elit.'),_react2.default.createElement('h2',{id:'integer-ut'},'Integer ut'),_react2.default.createElement('p',null,'Integer ut justo lectus. Praesent feugiat, erat non pretium luctus, dolor tellus gravida neque, a eleifend mi ex a neque. Cras massa velit, bibendum eget consectetur in, pretium eget libero. Suspendisse leo lorem, eleifend sed sapien sed, ultrices mattis mauris. Sed ac tortor a magna pretium pharetra. Mauris risus dolor, accumsan eget auctor id, porta quis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque nec mi quis dolor placerat accumsan. Phasellus congue mi sem, ut posuere lacus tempus ut.'),_react2.default.createElement('h2',{id:'praesent-vel'},'Praesent vel'),_react2.default.createElement('p',null,'Praesent vel nibh eu sapien fermentum dictum id id lectus. Sed risus nulla, tristique a mollis non, tincidunt eget eros. Duis metus dolor, cursus ut blandit a, ullamcorper ut nisl. Aliquam eu ex at nulla blandit vehicula. Quisque quis tellus quis turpis pharetra gravida. Sed eros justo, faucibus quis nunc nec, viverra sagittis felis. Ut pharetra egestas leo sit amet vestibulum. Nunc cursus ex non velit facilisis eleifend. Pellentesque eget orci pretium, pharetra magna efficitur, viverra lorem. Nam ullamcorper libero est, sit amet ultricies purus sagittis ac.'),_react2.default.createElement('h2',{id:'ut-posuere'},'Ut posuere'),_react2.default.createElement('p',null,'Ut posuere tellus eu est dapibus convallis. Proin posuere finibus arcu sed sagittis. Aenean sed aliquet urna, nec ullamcorper leo. Vestibulum vel nulla dictum, interdum ligula id, egestas eros. Vestibulum porttitor vel sem in ornare. Nam nunc ex, condimentum vitae imperdiet non, dapibus at sapien. Curabitur dictum velit at dolor tincidunt, a auctor tellus placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas condimentum blandit ipsum, ac mollis arcu euismod ac. Nullam ligula tortor, gravida sit amet rhoncus id, viverra vitae diam. Vivamus interdum leo sed vestibulum egestas. Sed fermentum faucibus metus, sed congue metus pulvinar id.'),_react2.default.createElement('h2',{id:'suspendisse-ut'},'Suspendisse ut'),_react2.default.createElement('p',null,'Suspendisse ut ligula ut est suscipit imperdiet. Phasellus tempus nec sem ac sodales. Praesent id venenatis ex. Aliquam posuere quam ac cursus consequat. Nulla eu ex scelerisque, blandit velit in, molestie elit. Aenean non justo at quam condimentum consectetur ac id augue. Nulla facilisi. Pellentesque pellentesque auctor erat. Suspendisse interdum pretium diam eget condimentum. Nullam vehicula nunc vel mauris sagittis, a consectetur risus vehicula. Fusce a ullamcorper arcu. Aenean auctor ante euismod orci finibus venenatis. Quisque leo risus, commodo vel nisi eget, ultricies iaculis ex. Duis lacinia euismod molestie. Praesent sit amet magna non odio porta pharetra.'),_react2.default.createElement('h2',{id:'nam-vel'},'Nam vel'),_react2.default.createElement('p',null,'Nam vel ante at augue aliquam eleifend eget vel leo. Phasellus tempor, nisi sed suscipit sagittis, arcu tellus consectetur lectus, quis ornare massa turpis ut mi. Nulla ultrices sapien nunc, vel vulputate sapien aliquet vel. Ut molestie metus ac dolor eleifend, sit amet lacinia quam gravida. Curabitur a aliquet tellus, at laoreet quam. Integer nec auctor enim. Nulla risus eros, feugiat id ligula at, vulputate scelerisque velit. Duis ut faucibus lacus, vitae fringilla turpis. Proin congue condimentum magna fringilla tincidunt. Cras lacinia, orci ac sollicitudin blandit, nisi erat rhoncus nunc, eu elementum justo nibh vel metus. Vestibulum sagittis tristique laoreet.'),_react2.default.createElement('h2',{id:'ut-venenatis'},'Ut venenatis'),_react2.default.createElement('p',null,'Ut venenatis, orci a venenatis volutpat, tortor sapien consectetur arcu, sit amet sagittis enim lorem eu libero. Nam eu pellentesque magna. Mauris eget scelerisque arcu, sit amet tristique mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce tincidunt enim id faucibus commodo. Aliquam a tellus ut magna mollis lacinia. Sed ut mauris suscipit nunc lacinia euismod a eu ipsum. Nunc id neque justo. Fusce ut justo ac nibh pretium tristique a in erat.'),_react2.default.createElement('h2',{id:'in-efficitur'},'In efficitur'),_react2.default.createElement('p',null,'In efficitur laoreet dui. Fusce et turpis mi. Cras lacinia euismod est et condimentum. Proin sit amet vestibulum nisi. Nullam vel arcu libero. Proin tempor lacus et metus condimentum hendrerit. Ut consequat, lorem eu aliquam rutrum, enim sem maximus lacus, a pellentesque arcu ex sed purus. Sed finibus dapibus urna non pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut gravida sem orci, sit amet rutrum sapien dapibus ut. Donec maximus suscipit nisi, ac elementum tortor maximus ut. Vestibulum cursus arcu lacus, rutrum vulputate tortor consectetur vel. Sed id augue maximus orci maximus vehicula cursus eget ligula. Duis purus nisl, dignissim at purus quis, cursus molestie velit. Aenean ultrices metus mi, ut feugiat diam efficitur eget. Duis at tellus vel augue fermentum pretium a sit amet est.'),_react2.default.createElement('h2',{id:'quisque-cursus'},'Quisque cursus'),_react2.default.createElement('p',null,'Quisque cursus enim et consequat feugiat. Vivamus et ex a orci cursus molestie nec et dui. Donec ac viverra diam, convallis aliquet lorem. Nullam efficitur nibh lorem, ac suscipit felis rhoncus non. In elementum cursus pulvinar. Nullam sollicitudin rhoncus lacus, nec dictum magna pulvinar aliquet. Nullam sit amet congue quam, non ultricies ipsum. Integer nec nulla a felis semper aliquet quis sed metus. Fusce aliquet ac massa non maximus. Suspendisse tincidunt imperdiet pharetra.'));}}]);return One;}(_react2.default.Component);exports.default=One;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(19);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{}}};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _pageShell=__webpack_require__(5);var _pageShell2=_interopRequireDefault(_pageShell);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Two=function(_React$Component){_inherits(Two,_React$Component);function Two(){_classCallCheck(this,Two);return _possibleConstructorReturn(this,(Two.__proto__||Object.getPrototypeOf(Two)).apply(this,arguments));}_createClass(Two,[{key:'render',value:function render(){return _react2.default.createElement(_pageShell2.default,null,_react2.default.createElement('ul',null,_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-lorem-ipsum'},'two-lorem-ipsum')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-nam-rhoncus'},'two-nam-rhoncus')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-integer-ut'},'two-integer-ut')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-praesent-vel'},'two-praesent-vel')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-ut-posuere'},'two-ut-posuere')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-suspendisse-ut'},'two-suspendisse-ut')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-nam-vel'},'two-nam-vel')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-ut-venenatis'},'two-ut-venenatis')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-in-efficitur'},'two-in-efficitur')),_react2.default.createElement('li',null,_react2.default.createElement('a',{href:'#two-quisque-cursus'},'two-quisque-cursus'))),_react2.default.createElement('h2',{id:'two-lorem-ipsum'},'TWO Lorem ipsum'),_react2.default.createElement('p',null,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum auctor erat rutrum consectetur. Ut sit amet mi pulvinar, mattis ex quis, tincidunt nunc. Mauris quis lacinia quam. Praesent congue neque dui, nec maximus diam ullamcorper vitae. Quisque odio nunc, aliquet at luctus vel, egestas eu felis. Vivamus vitae justo maximus, egestas massa quis, varius nisi. Phasellus bibendum tortor non massa bibendum, sit amet dapibus augue venenatis. In hac habitasse platea dictumst. Suspendisse accumsan, felis eu pharetra dignissim, sem ante tristique augue, ornare tristique risus ex imperdiet velit. Proin nulla neque, luctus eu arcu eget, facilisis consectetur arcu. Proin mollis sem sit amet ante imperdiet elementum. Curabitur in erat tincidunt, pharetra libero sed, vestibulum ipsum. Duis ut consequat libero, eu auctor quam. Maecenas sit amet ex nec orci iaculis pharetra. Praesent non augue metus. Ut rhoncus placerat felis.'),_react2.default.createElement('h2',{id:'two-nam-rhoncus'},'TWO Nam rhoncus'),_react2.default.createElement('p',null,'Nam rhoncus metus efficitur nisi pulvinar tincidunt. Aliquam erat volutpat. Ut a elementum ipsum, ac posuere nulla. Nam lobortis ac nisl et varius. Curabitur nec commodo lacus. Proin consectetur posuere velit vel pulvinar. Nullam condimentum eleifend ante, nec egestas eros tristique id. Aliquam at ornare dui. Fusce auctor tellus pharetra suscipit volutpat. In sed enim eu quam condimentum sollicitudin non tristique elit.'),_react2.default.createElement('h2',{id:'two-integer-ut'},'TWO Integer ut'),_react2.default.createElement('p',null,'Integer ut justo lectus. Praesent feugiat, erat non pretium luctus, dolor tellus gravida neque, a eleifend mi ex a neque. Cras massa velit, bibendum eget consectetur in, pretium eget libero. Suspendisse leo lorem, eleifend sed sapien sed, ultrices mattis mauris. Sed ac tortor a magna pretium pharetra. Mauris risus dolor, accumsan eget auctor id, porta quis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque nec mi quis dolor placerat accumsan. Phasellus congue mi sem, ut posuere lacus tempus ut.'),_react2.default.createElement('h2',{id:'two-praesent-vel'},'TWO Praesent vel'),_react2.default.createElement('p',null,'Praesent vel nibh eu sapien fermentum dictum id id lectus. Sed risus nulla, tristique a mollis non, tincidunt eget eros. Duis metus dolor, cursus ut blandit a, ullamcorper ut nisl. Aliquam eu ex at nulla blandit vehicula. Quisque quis tellus quis turpis pharetra gravida. Sed eros justo, faucibus quis nunc nec, viverra sagittis felis. Ut pharetra egestas leo sit amet vestibulum. Nunc cursus ex non velit facilisis eleifend. Pellentesque eget orci pretium, pharetra magna efficitur, viverra lorem. Nam ullamcorper libero est, sit amet ultricies purus sagittis ac.'),_react2.default.createElement('h2',{id:'two-ut-posuere'},'TWO Ut posuere'),_react2.default.createElement('p',null,'Ut posuere tellus eu est dapibus convallis. Proin posuere finibus arcu sed sagittis. Aenean sed aliquet urna, nec ullamcorper leo. Vestibulum vel nulla dictum, interdum ligula id, egestas eros. Vestibulum porttitor vel sem in ornare. Nam nunc ex, condimentum vitae imperdiet non, dapibus at sapien. Curabitur dictum velit at dolor tincidunt, a auctor tellus placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas condimentum blandit ipsum, ac mollis arcu euismod ac. Nullam ligula tortor, gravida sit amet rhoncus id, viverra vitae diam. Vivamus interdum leo sed vestibulum egestas. Sed fermentum faucibus metus, sed congue metus pulvinar id.'),_react2.default.createElement('h2',{id:'two-suspendisse-ut'},'TWO Suspendisse ut'),_react2.default.createElement('p',null,'Suspendisse ut ligula ut est suscipit imperdiet. Phasellus tempus nec sem ac sodales. Praesent id venenatis ex. Aliquam posuere quam ac cursus consequat. Nulla eu ex scelerisque, blandit velit in, molestie elit. Aenean non justo at quam condimentum consectetur ac id augue. Nulla facilisi. Pellentesque pellentesque auctor erat. Suspendisse interdum pretium diam eget condimentum. Nullam vehicula nunc vel mauris sagittis, a consectetur risus vehicula. Fusce a ullamcorper arcu. Aenean auctor ante euismod orci finibus venenatis. Quisque leo risus, commodo vel nisi eget, ultricies iaculis ex. Duis lacinia euismod molestie. Praesent sit amet magna non odio porta pharetra.'),_react2.default.createElement('h2',{id:'two-nam-vel'},'TWO Nam vel'),_react2.default.createElement('p',null,'Nam vel ante at augue aliquam eleifend eget vel leo. Phasellus tempor, nisi sed suscipit sagittis, arcu tellus consectetur lectus, quis ornare massa turpis ut mi. Nulla ultrices sapien nunc, vel vulputate sapien aliquet vel. Ut molestie metus ac dolor eleifend, sit amet lacinia quam gravida. Curabitur a aliquet tellus, at laoreet quam. Integer nec auctor enim. Nulla risus eros, feugiat id ligula at, vulputate scelerisque velit. Duis ut faucibus lacus, vitae fringilla turpis. Proin congue condimentum magna fringilla tincidunt. Cras lacinia, orci ac sollicitudin blandit, nisi erat rhoncus nunc, eu elementum justo nibh vel metus. Vestibulum sagittis tristique laoreet.'),_react2.default.createElement('h2',{id:'two-ut-venenatis'},'TWO Ut venenatis'),_react2.default.createElement('p',null,'Ut venenatis, orci a venenatis volutpat, tortor sapien consectetur arcu, sit amet sagittis enim lorem eu libero. Nam eu pellentesque magna. Mauris eget scelerisque arcu, sit amet tristique mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce tincidunt enim id faucibus commodo. Aliquam a tellus ut magna mollis lacinia. Sed ut mauris suscipit nunc lacinia euismod a eu ipsum. Nunc id neque justo. Fusce ut justo ac nibh pretium tristique a in erat.'),_react2.default.createElement('h2',{id:'two-in-efficitur'},'TWO In efficitur'),_react2.default.createElement('p',null,'In efficitur laoreet dui. Fusce et turpis mi. Cras lacinia euismod est et condimentum. Proin sit amet vestibulum nisi. Nullam vel arcu libero. Proin tempor lacus et metus condimentum hendrerit. Ut consequat, lorem eu aliquam rutrum, enim sem maximus lacus, a pellentesque arcu ex sed purus. Sed finibus dapibus urna non pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut gravida sem orci, sit amet rutrum sapien dapibus ut. Donec maximus suscipit nisi, ac elementum tortor maximus ut. Vestibulum cursus arcu lacus, rutrum vulputate tortor consectetur vel. Sed id augue maximus orci maximus vehicula cursus eget ligula. Duis purus nisl, dignissim at purus quis, cursus molestie velit. Aenean ultrices metus mi, ut feugiat diam efficitur eget. Duis at tellus vel augue fermentum pretium a sit amet est.'),_react2.default.createElement('h2',{id:'two-quisque-cursus'},'TWO Quisque cursus'),_react2.default.createElement('p',null,'Quisque cursus enim et consequat feugiat. Vivamus et ex a orci cursus molestie nec et dui. Donec ac viverra diam, convallis aliquet lorem. Nullam efficitur nibh lorem, ac suscipit felis rhoncus non. In elementum cursus pulvinar. Nullam sollicitudin rhoncus lacus, nec dictum magna pulvinar aliquet. Nullam sit amet congue quam, non ultricies ipsum. Integer nec nulla a felis semper aliquet quis sed metus. Fusce aliquet ac massa non maximus. Suspendisse tincidunt imperdiet pharetra.'));}}]);return Two;}(_react2.default.Component);exports.default=Two;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
var fs=__webpack_require__(4);var UglifyJs=__webpack_require__(21);function renderInlineJsScripts(inlineJsEntries){if(!inlineJsEntries){return'';}return inlineJsEntries.map(function(jsData){var code=fs.readFileSync(jsData.filename,'utf8');if(jsData.uglify!==false){var uglified=UglifyJs.minify(code);if(uglified.error)throw uglified.error;code=uglified.code;}return'<script>'+code+'</script>';}).join('\n');}module.exports=renderInlineJsScripts;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/uglify-js/tools/node.js");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.renderHtmlPage=renderHtmlPage;var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _server=__webpack_require__(23);var _server2=_interopRequireDefault(_server);var _reactHelmet=__webpack_require__(24);var _reactHelmet2=_interopRequireDefault(_reactHelmet);var _batfishApp=__webpack_require__(25);var _batfishSpaApp=__webpack_require__(38);var _staticHtmlPage=__webpack_require__(39);var _constants=__webpack_require__(40);var _constants2=_interopRequireDefault(_constants);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function renderHtmlPage(options){return options.route.getPage().then(function(pageModule){// We render the page content separately from the StaticHtmlPage, because
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
Object.defineProperty(exports,"__esModule",{value:true});exports.Router=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(27);var _propTypes2=_interopRequireDefault(_propTypes);var _linkHijacker=__webpack_require__(32);var _linkHijacker2=_interopRequireDefault(_linkHijacker);var _scrollRestorer=__webpack_require__(6);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _linkToLocation=__webpack_require__(33);var _linkToLocation2=_interopRequireDefault(_linkToLocation);var _querySelectorContainsNode=__webpack_require__(34);var _querySelectorContainsNode2=_interopRequireDefault(_querySelectorContainsNode);var _context=__webpack_require__(1);var _routeTo=__webpack_require__(35);var _prefixUrl=__webpack_require__(2);var _findMatchingRoute=__webpack_require__(7);var _scrollToFragment=__webpack_require__(8);var _getWindow=__webpack_require__(3);var _changePage=__webpack_require__(36);var _getCurrentLocation=__webpack_require__(9);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
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
Object.defineProperty(exports,"__esModule",{value:true});exports.routeToPrefixed=exports.routeTo=undefined;var _prefixUrl=__webpack_require__(2);var delayed=void 0;//      
var routeToHandler=void 0;function routeTo(url){if(delayed){return;}if(!routeToHandler){delayed=url;return;}routeToHandler(url);}function routeToPrefixed(url){routeTo((0,_prefixUrl.prefixUrl)(url));}// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._setRouteToHandler=function(handler){routeToHandler=handler;if(delayed){routeToHandler(delayed);delayed=null;}};// For tests.
routeTo._clearRouteToHandler=function(){routeToHandler=null;};exports.routeTo=routeTo;exports.routeToPrefixed=routeToPrefixed;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.changePage=changePage;var _scrollRestorer=__webpack_require__(6);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _findMatchingRoute=__webpack_require__(7);var _scrollToFragment=__webpack_require__(8);var _routeChangeListeners=__webpack_require__(37);var _getCurrentLocation=__webpack_require__(9);var _getWindow=__webpack_require__(3);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}//      
function changePage(nextLocation,setRouterState){var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};var onFinish=arguments[3];var win=(0,_getWindow.getWindow)();var matchingRoute=(0,_findMatchingRoute.findMatchingRoute)(nextLocation.pathname);var nextUrl=[nextLocation.pathname,nextLocation.hash,nextLocation.search].join('');// Call the change-start callbacks immediately, not after the page chunk
// has already been fetched.
var startChange=(0,_routeChangeListeners._invokeRouteChangeStartCallbacks)(nextLocation.pathname);return matchingRoute.getPage().then(function(pageModule){return startChange.then(function(){return pageModule;});}).then(function(pageModule){if(options.pushState){win.history.pushState({},null,nextUrl);}var nextState={path:matchingRoute.path,PageComponent:pageModule.component,pageProps:pageModule.props,location:(0,_getCurrentLocation.getCurrentLocation)()};setRouterState(nextState,function(){if(nextLocation.hash){(0,_scrollToFragment.scrollToFragment)();}else if(options.scrollToTop){win.scrollTo(0,0);}else if(_scrollRestorer2.default.getSavedScroll()){_scrollRestorer2.default.restoreScroll();}if(onFinish)onFinish();(0,_routeChangeListeners._invokeRouteChangeEndCallbacks)(nextLocation.pathname);});});}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.invokeCallbacks=invokeCallbacks;exports.addRouteChangeStartListener=addRouteChangeStartListener;exports.removeRouteChangeStartListener=removeRouteChangeStartListener;exports.addRouteChangeEndListener=addRouteChangeEndListener;exports.removeRouteChangeEndListener=removeRouteChangeEndListener;exports._invokeRouteChangeStartCallbacks=_invokeRouteChangeStartCallbacks;exports._invokeRouteChangeEndCallbacks=_invokeRouteChangeEndCallbacks;var _prefixUrl=__webpack_require__(2);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}//      
var ALL_PATHS='*';var startListeners=_defineProperty({},ALL_PATHS,[]);var endListeners=_defineProperty({},ALL_PATHS,[]);function normalizePathname(pathname){if(pathname!==ALL_PATHS&&!(0,_prefixUrl.isUrlPrefixed)(pathname)){pathname=(0,_prefixUrl.prefixUrl)(pathname);}return pathname.replace(/\/$/,'');}function addListener(pathnameOrListener,maybeListener,registry,remover){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!registry[pathname]){registry[pathname]=[];}registry[pathname].push(listener||noop);return function(){return remover(pathname,listener);};}function removeListener(pathnameOrListener,maybeListener,registry){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'||!pathnameOrListener){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!listener){registry[pathname]=[];return;}var listeners=registry[pathname];for(var i=0,l=listeners.length;i<l;i++){if(listeners[i]===listener){listeners.splice(i,1);return;}}}function invokeCallbacks(nextPathname,registery){nextPathname=normalizePathname(nextPathname);var promisesToKeep=[Promise.resolve()];if(registery[nextPathname]){registery[nextPathname].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});}registery[ALL_PATHS].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});return Promise.all(promisesToKeep);}function addRouteChangeStartListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,startListeners,removeRouteChangeStartListener);}function removeRouteChangeStartListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,startListeners);}function addRouteChangeEndListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,endListeners,removeRouteChangeEndListener);}function removeRouteChangeEndListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,endListeners);}function _invokeRouteChangeStartCallbacks(nextPathname){return invokeCallbacks(nextPathname,startListeners);}function _invokeRouteChangeEndCallbacks(nextPathname){return invokeCallbacks(nextPathname,endListeners);}function noop(){}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.BatfishSpaApp=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _applicationWrapper=__webpack_require__(10);var _applicationWrapper2=_interopRequireDefault(_applicationWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var BatfishSpaApp=exports.BatfishSpaApp=function(_React$Component){_inherits(BatfishSpaApp,_React$Component);function BatfishSpaApp(){_classCallCheck(this,BatfishSpaApp);return _possibleConstructorReturn(this,(BatfishSpaApp.__proto__||Object.getPrototypeOf(BatfishSpaApp)).apply(this,arguments));}_createClass(BatfishSpaApp,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var body=_react2.default.createElement(this.props.pageModule.component,this.props.pageModule.props);return _react2.default.createElement(_applicationWrapper2.default,null,body);}}]);return BatfishSpaApp;}(_react2.default.Component);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.StaticHtmlPage=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
// This component is used by static-render-pages to create an HTML document.
var StaticHtmlPage=function(_React$Component){_inherits(StaticHtmlPage,_React$Component);function StaticHtmlPage(){_classCallCheck(this,StaticHtmlPage);return _possibleConstructorReturn(this,(StaticHtmlPage.__proto__||Object.getPrototypeOf(StaticHtmlPage)).apply(this,arguments));}_createClass(StaticHtmlPage,[{key:'shouldComponentUpdate',// This should never be updated by React
value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var head=null;if(this.props.appendToHead){head=_react2.default.createElement('head',{dangerouslySetInnerHTML:{__html:this.props.appendToHead.join('\n')}});}var appendToBody=null;if(this.props.appendToBody){appendToBody=_react2.default.createElement('div',{dangerouslySetInnerHTML:{__html:this.props.appendToBody.join('\n')}});}var app=_react2.default.createElement('div',{id:'batfish-content'},this.props.content);if(this.props.rawAppHtml){app=_react2.default.createElement('div',{id:'batfish-content',dangerouslySetInnerHTML:{__html:this.props.rawAppHtml}});}return _react2.default.createElement('html',_extends({lang:'en'},this.props.htmlAttributes),head,_react2.default.createElement('body',this.props.bodyAttributes,app,appendToBody));}}]);return StaticHtmlPage;}(_react2.default.Component);exports.StaticHtmlPage=StaticHtmlPage;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
module.exports=Object.freeze({INLINE_CSS_MARKER:'<!-- INLINE CSS HERE, BATFISH -->',BATFISH_CSS_BASENAME:'batfish-styles.css',STATS_BASENAME:'stats.json',DATA_DIRECTORY:'data',EVENT_ERROR:'error',EVENT_NOTIFICATION:'notification',EVENT_DONE:'done',TARGET_NODE:'node',TARGET_BROWSER:'browser',PAGE_EXT_GLOB:'{js,md}'});

/***/ })
/******/ ]);
//# sourceMappingURL=static-render-pages.js.map