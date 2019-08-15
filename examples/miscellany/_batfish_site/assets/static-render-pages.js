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
/******/ 	__webpack_require__.p = "/miscellany/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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
Object.defineProperty(exports,"__esModule",{value:true});exports.routeToPrefixed=exports.routeTo=undefined;var _prefixUrl=__webpack_require__(1);var delayed=void 0;//      
var routeToHandler=void 0;function routeTo(url){if(delayed){return;}if(!routeToHandler){delayed=url;return;}routeToHandler(url);}function routeToPrefixed(url){routeTo((0,_prefixUrl.prefixUrl)(url));}// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._setRouteToHandler=function(handler){routeToHandler=handler;if(delayed){routeToHandler(delayed);delayed=null;}};// For tests.
routeTo._clearRouteToHandler=function(){routeToHandler=null;};exports.routeTo=routeTo;exports.routeToPrefixed=routeToPrefixed;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(5);var _propTypes2=_interopRequireDefault(_propTypes);var _reactHelmet=__webpack_require__(11);var _prefixUrl=__webpack_require__(1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var PageShell=function(_React$Component){_inherits(PageShell,_React$Component);function PageShell(){_classCallCheck(this,PageShell);return _possibleConstructorReturn(this,(PageShell.__proto__||Object.getPrototypeOf(PageShell)).apply(this,arguments));}_createClass(PageShell,[{key:'render',value:function render(){var props=this.props;var title=props.frontMatter.title+' | Miscellany';return _react2.default.createElement('div',null,_react2.default.createElement(_reactHelmet.Helmet,null,_react2.default.createElement('html',{lang:'en'}),_react2.default.createElement('meta',{charSet:'utf-8'}),_react2.default.createElement('meta',{name:'viewport',content:'width=device-width, initial-scale=1'}),_react2.default.createElement('title',null,title),_react2.default.createElement('meta',{name:'description',content:props.frontMatter.description}),_react2.default.createElement('meta',{name:'og:title',content:props.frontMatter.title}),_react2.default.createElement('meta',{name:'og:description',content:props.frontMatter.description}),_react2.default.createElement('meta',{name:'og:type',content:'website'}),_react2.default.createElement('meta',{name:'og:url',content:'https://www.your-batfish-site.com/miscellany'+props.location.pathname})),_react2.default.createElement('div',{className:'px24 py24 mx-auto',style:{maxWidth:960}},_react2.default.createElement('div',{className:'mb36 flex-parent flex-parent--center-cross bg-gray px24 py12'},_react2.default.createElement('a',{className:'flex-child link link--white txt-bold txt-uppercase',href:(0,_prefixUrl.prefixUrl)('/')},'Home'),_react2.default.createElement('a',{className:'flex-child link link--white txt-bold txt-uppercase ml24',href:(0,_prefixUrl.prefixUrl)('/holidays/')},'Holidays'),_react2.default.createElement('a',{className:'flex-child link link--white txt-bold txt-uppercase ml24',href:(0,_prefixUrl.prefixUrl)('/stories/')},'Stories')),props.children));}}]);return PageShell;}(_react2.default.Component);exports.default=PageShell;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _storiesData=__webpack_require__(15);var _storiesData2=_interopRequireDefault(_storiesData);var _pageShell=__webpack_require__(3);var _pageShell2=_interopRequireDefault(_pageShell);var _sidebarNavigation=__webpack_require__(14);var _sidebarNavigation2=_interopRequireDefault(_sidebarNavigation);var _getLegibleDate=__webpack_require__(45);var _getLegibleDate2=_interopRequireDefault(_getLegibleDate);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var sidebarItems=_storiesData2.default.map(function(story){return{content:story.frontMatter.title,url:story.path};});var StoryWrapper=function(_React$Component){_inherits(StoryWrapper,_React$Component);function StoryWrapper(){_classCallCheck(this,StoryWrapper);return _possibleConstructorReturn(this,(StoryWrapper.__proto__||Object.getPrototypeOf(StoryWrapper)).apply(this,arguments));}_createClass(StoryWrapper,[{key:'render',value:function render(){var props=this.props;var subtitleElement=_react2.default.createElement('div',{className:'pt-4'});if(props.frontMatter.subtitle){subtitleElement=_react2.default.createElement('div',{className:'txt-l txt-em my24'},props.frontMatter.subtitle);}return _react2.default.createElement(_pageShell2.default,props,_react2.default.createElement('div',{className:'grid grid--gut36'},_react2.default.createElement('div',{className:'col col--3'},_react2.default.createElement(_sidebarNavigation2.default,{title:'Stories',items:sidebarItems})),_react2.default.createElement('div',{className:'col col--9'},_react2.default.createElement('h1',{className:'txt-h1 mb24'},props.frontMatter.title),subtitleElement,_react2.default.createElement('div',{className:'prose'},props.children),_react2.default.createElement('div',{className:'txt-s color-gray align-r mt12'},'Posted ',(0,_getLegibleDate2.default)(props.frontMatter.date)))));}}]);return StoryWrapper;}(_react2.default.Component);exports.default=StoryWrapper;

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var batfishContext=exports.batfishContext={selectedConfig:{siteBasePath:'/miscellany',siteOrigin:'https://www.your-batfish-site.com',hijackLinks:true,manageScrollRestoration:true},routes:[{path:'/miscellany/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 26));}},{path:'/miscellany/404/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 12));},is404:true},{path:'/miscellany/holidays/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 33));}},{path:'/miscellany/holidays/independence-day/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 35));}},{path:'/miscellany/holidays/labor-day/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 37));}},{path:'/miscellany/holidays/memorial-day/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 39));}},{path:'/miscellany/stories/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 41));}},{path:'/miscellany/stories/five-white-mice/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 43));}},{path:'/miscellany/stories/great-mistake/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 46));}},{path:'/miscellany/stories/ominous-baby/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 48));}},{path:'/miscellany/stories/open-boat/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 50));}},{path:'/miscellany/stories/wise-men/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 52));}}],notFoundRoute:{path:'/miscellany/404/',getPage:function getPage(){return new Promise(function(resolve) { resolve(); }).then(__webpack_require__.bind(null, 12));},is404:true}};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _holidaysData=__webpack_require__(13);var _holidaysData2=_interopRequireDefault(_holidaysData);var _pageShell=__webpack_require__(3);var _pageShell2=_interopRequireDefault(_pageShell);var _sidebarNavigation=__webpack_require__(14);var _sidebarNavigation2=_interopRequireDefault(_sidebarNavigation);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var sidebarItems=_holidaysData2.default.map(function(holiday){return{content:_react2.default.createElement('div',null,holiday.frontMatter.title,_react2.default.createElement('div',{className:'txt-s pl12'},'(',holiday.frontMatter.date,')')),url:holiday.path};});var HolidayWrapper=function(_React$Component){_inherits(HolidayWrapper,_React$Component);function HolidayWrapper(){_classCallCheck(this,HolidayWrapper);return _possibleConstructorReturn(this,(HolidayWrapper.__proto__||Object.getPrototypeOf(HolidayWrapper)).apply(this,arguments));}_createClass(HolidayWrapper,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_pageShell2.default,props,_react2.default.createElement('div',{className:'grid grid--gut36'},_react2.default.createElement('div',{className:'col col--3'},_react2.default.createElement(_sidebarNavigation2.default,{title:'Holidays',items:sidebarItems})),_react2.default.createElement('div',{className:'col col--9'},_react2.default.createElement('h1',{className:'txt-h1'},props.frontMatter.title),_react2.default.createElement('div',{className:'bg-gray color-white px12 py6 inline-block txt-bold my12'},props.frontMatter.date),_react2.default.createElement('div',{className:'prose'},props.children))));}}]);return HolidayWrapper;}(_react2.default.Component);exports.default=HolidayWrapper;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(5);var _propTypes2=_interopRequireDefault(_propTypes);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var HolidayImage=function(_React$PureComponent){_inherits(HolidayImage,_React$PureComponent);function HolidayImage(){_classCallCheck(this,HolidayImage);return _possibleConstructorReturn(this,(HolidayImage.__proto__||Object.getPrototypeOf(HolidayImage)).apply(this,arguments));}_createClass(HolidayImage,[{key:'render',value:function render(){var props=this.props;var style=props.style;if(style.maxWidth===undefined){style.maxWidth='100%';}return _react2.default.createElement('div',{className:'my24'},_react2.default.createElement('img',{src:props.src,style:style,className:'mb-3'}));}}]);return HolidayImage;}(_react2.default.PureComponent);exports.default=HolidayImage;HolidayImage.defaultProps={style:{}};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.getWindow=getWindow;//      
function getWindow(){if(typeof window==='undefined'){throw new Error('Do not call getWindow in code that will run during the static build.');}return window;}

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("react-helmet");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(32);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{}}};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
module.exports=[{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/holidays/memorial-day.js","path":"/miscellany/holidays/memorial-day/","frontMatter":{"title":"Memorial Day","description":"Description of Memorial Day.","date":"Last Monday of May","month":5}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/holidays/independence-day.js","path":"/miscellany/holidays/independence-day/","frontMatter":{"title":"Independence Day","description":"Description of Independence Day.","date":"4th of July","month":7}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/holidays/labor-day.js","path":"/miscellany/holidays/labor-day/","frontMatter":{"title":"Labor Day","description":"Description of Labor Day.","date":"First Monday of September","month":"09"}}];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(5);var _propTypes2=_interopRequireDefault(_propTypes);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var SidebarNavigation=function(_React$PureComponent){_inherits(SidebarNavigation,_React$PureComponent);function SidebarNavigation(){_classCallCheck(this,SidebarNavigation);return _possibleConstructorReturn(this,(SidebarNavigation.__proto__||Object.getPrototypeOf(SidebarNavigation)).apply(this,arguments));}_createClass(SidebarNavigation,[{key:'render',value:function render(){var props=this.props;var itemElements=props.items.map(function(item){var linkClasses='link block py6 border-b border--gray-light';return _react2.default.createElement('li',{key:item.url},_react2.default.createElement('a',{href:item.url,className:linkClasses},item.content));});return _react2.default.createElement('div',null,_react2.default.createElement('div',{className:'txt-h3 mb12'},props.title),_react2.default.createElement('ul',null,itemElements));}}]);return SidebarNavigation;}(_react2.default.PureComponent);exports.default=SidebarNavigation;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
module.exports=[{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/stories/great-mistake.md","path":"/miscellany/stories/great-mistake/","frontMatter":{"title":"A Great Mistake","description":"Stephen Crane's story of a great mistake.","date":"2017-12-13"}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/stories/ominous-baby.md","path":"/miscellany/stories/ominous-baby/","frontMatter":{"title":"An Ominous Baby","description":"Stephen Crane's story of an ominous baby.","date":"2014-11-12"}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/stories/five-white-mice.md","path":"/miscellany/stories/five-white-mice/","frontMatter":{"title":"The Five White Mice","subtitle":"Oh, five white mice of chance, / Shirts of wool and corduroy pants ...","description":"A mouse story by Stephen Crane","date":"2014-08-11"}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/stories/open-boat.md","path":"/miscellany/stories/open-boat/","frontMatter":{"title":"The Open Boat","subtitle":"A tale intended to be after the fact. Being the experience of four men from the sunk steamer 'Commodore'.","description":"The first part of a story by Stephen Crane","date":"2014-09-11"}},{"filePath":"/Users/dan/Documents/github/batfish/examples/miscellany/src/pages/stories/wise-men.md","path":"/miscellany/stories/wise-men/","frontMatter":{"title":"The Wise Men","description":"A story by Stephen Crane about youths with subtle minds.","date":"2014-10-11"}}];

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/scroll-restorer/index.js");

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.findMatchingRoute=findMatchingRoute;var _context=__webpack_require__(6);// Returns an array of regular expressions that are used to check whether a URL
// path matches one of the routes.
function createPathRegExps(routes){return routes.reduce(function(result,route){// Pages with internal routing aren't just exact matches.
var ending=route.internalRouting?'(/.+)?$':'$';// ? because the last slash is optional
result[route.path]=new RegExp('^'+route.path.replace(/\//g,'[/]')+'?'+ending);return result;},{});}//      
var pathRegExpsCache=void 0;var urlPathsCache={};// Find the route data that matches a URL path.
//
// Returns the matching route, or the not-found route if no matching route exists.
function findMatchingRoute(urlPath,options){options=options||{};var useCache=options.useCache===undefined?true:options.useCache;if(useCache&&urlPathsCache[urlPath]){return urlPathsCache[urlPath];}var pathRegExps=void 0;if(useCache&&pathRegExpsCache){pathRegExps=pathRegExpsCache;}else{pathRegExps=createPathRegExps(_context.batfishContext.routes);pathRegExpsCache=pathRegExps;}var result=void 0;for(var i=0;i<_context.batfishContext.routes.length;i++){var route=_context.batfishContext.routes[i];if(pathRegExps[route.path].test(urlPath)){result=route;break;}}if(!result){result=_context.batfishContext.notFoundRoute;}urlPathsCache[urlPath]=result;return result;}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.scrollToFragment=scrollToFragment;//      
// Check the current location for a hash, and if there is one try to scroll to it.
function scrollToFragment(){var fragment=window.location.hash;if(!fragment)return;var element=document.getElementById(fragment.replace('#',''));if(element){element.scrollIntoView();}}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.getCurrentLocation=getCurrentLocation;var _getWindow=__webpack_require__(9);function getCurrentLocation(){var win=(0,_getWindow.getWindow)();var pathname=win.location.pathname;if(!/\/$/.test(pathname))pathname+='/';return{pathname:pathname,hash:win.location.hash,search:win.location.search};}//

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var ApplicationWrapper=function(_React$Component){_inherits(ApplicationWrapper,_React$Component);function ApplicationWrapper(){_classCallCheck(this,ApplicationWrapper);return _possibleConstructorReturn(this,(ApplicationWrapper.__proto__||Object.getPrototypeOf(ApplicationWrapper)).apply(this,arguments));}_createClass(ApplicationWrapper,[{key:"render",value:function render(){return _react2.default.createElement("div",{id:"application-wrapper"},this.props.children);}}]);return ApplicationWrapper;}(_react2.default.Component);exports.default=ApplicationWrapper;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});__webpack_require__(22);var _fs=__webpack_require__(10);var _fs2=_interopRequireDefault(_fs);var _pify=__webpack_require__(23);var _pify2=_interopRequireDefault(_pify);var _mkdirp=__webpack_require__(24);var _mkdirp2=_interopRequireDefault(_mkdirp);var _path=__webpack_require__(25);var _path2=_interopRequireDefault(_path);var _context=__webpack_require__(6);var _renderInlineJsScripts=__webpack_require__(54);var _renderInlineJsScripts2=_interopRequireDefault(_renderInlineJsScripts);var _renderHtmlPage=__webpack_require__(56);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// Statically render pages as HTML.
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
/* 22 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/source-map-support/register.js");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/pify/index.js");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/mkdirp/index.js");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(27);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Home","description":"The home page of my miscellany."}}};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _pageShell=__webpack_require__(3);var _pageShell2=_interopRequireDefault(_pageShell);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Home
description: The home page of my miscellany.
---*/var Home=function(_React$Component){_inherits(Home,_React$Component);function Home(){_classCallCheck(this,Home);return _possibleConstructorReturn(this,(Home.__proto__||Object.getPrototypeOf(Home)).apply(this,arguments));}_createClass(Home,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_pageShell2.default,props,_react2.default.createElement('h1',{className:'txt-h1 txt-bold mb12'},'The Batfish Miscellany'),_react2.default.createElement('div',{className:'my24'},_react2.default.createElement('a',{className:'link link--purple txt-h3',href:(0,_prefixUrl.prefixUrl)('/holidays/')},'Read about holidays.')),_react2.default.createElement('div',{className:'my24'},_react2.default.createElement('a',{className:'link link--purple txt-h3',href:(0,_prefixUrl.prefixUrl)('/stories/')},'Read stories by Stephen Crane.')));}}]);return Home;}(_react2.default.Component);exports.default=Home;

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var NotFound=function(_React$Component){_inherits(NotFound,_React$Component);function NotFound(){_classCallCheck(this,NotFound);return _possibleConstructorReturn(this,(NotFound.__proto__||Object.getPrototypeOf(NotFound)).apply(this,arguments));}_createClass(NotFound,[{key:"render",value:function render(){return _react2.default.createElement("div",{className:"viewport-full flex-parent flex-parent--center-main flex-parent--center-cross"},_react2.default.createElement("div",{className:"flex-child txt-h1"},"404: Page not found"));}}]);return NotFound;}(_react2.default.Component);exports.default=NotFound;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(34);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Holidays","description":"A collection of articles about holidays."}}};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _holidaysData=__webpack_require__(13);var _holidaysData2=_interopRequireDefault(_holidaysData);var _pageShell=__webpack_require__(3);var _pageShell2=_interopRequireDefault(_pageShell);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Holidays
description: A collection of articles about holidays.
---*/var Holidays=function(_React$Component){_inherits(Holidays,_React$Component);function Holidays(){_classCallCheck(this,Holidays);return _possibleConstructorReturn(this,(Holidays.__proto__||Object.getPrototypeOf(Holidays)).apply(this,arguments));}_createClass(Holidays,[{key:'render',value:function render(){var props=this.props;var holidayItems=_holidaysData2.default.map(function(holiday){return _react2.default.createElement('a',{key:holiday.path,className:'block py24 border-b border--gray-light link link--purple',href:holiday.path},_react2.default.createElement('div',{className:'inline-block txt-h3 mr12'},holiday.frontMatter.title),_react2.default.createElement('div',{className:'inline-block pl12'},'(',holiday.frontMatter.date,')'));});return _react2.default.createElement(_pageShell2.default,props,_react2.default.createElement('h1',{className:'txt-h1 txt-bold mb12'},'Holidays!'),holidayItems);}}]);return Holidays;}(_react2.default.Component);exports.default=Holidays;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(36);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Independence Day","description":"Description of Independence Day.","date":"4th of July","month":7}}};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _holidayWrapper=__webpack_require__(7);var _holidayWrapper2=_interopRequireDefault(_holidayWrapper);var _holidayImage=__webpack_require__(8);var _holidayImage2=_interopRequireDefault(_holidayImage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Independence Day
description: Description of Independence Day.
date: "4th of July"
month: 07
---*/var IndependenceDay=function(_React$Component){_inherits(IndependenceDay,_React$Component);function IndependenceDay(){_classCallCheck(this,IndependenceDay);return _possibleConstructorReturn(this,(IndependenceDay.__proto__||Object.getPrototypeOf(IndependenceDay)).apply(this,arguments));}_createClass(IndependenceDay,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_holidayWrapper2.default,props,_react2.default.createElement(_holidayImage2.default,{src:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Fourth_of_July_fireworks_behind_the_Washington_Monument%2C_1986.jpg/787px-Fourth_of_July_fireworks_behind_the_Washington_Monument%2C_1986.jpg',style:{maxHeight:400}}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,_react2.default.createElement('strong',null,'Independence Day'),', also referred to as the Fourth of July or July Fourth, is a federal holiday in the United States commemorating the adoption of the ',_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/United_States_Declaration_of_Independence'},'Declaration of Independence'),' on July 4, 1776. The Continental Congress declared that the thirteen American colonies regarded themselves as a new nation, the United States of America, and were no longer part of the British Empire. The Congress actually voted to declare independence two days earlier, on July 2.'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,'Independence Day'),' is commonly associated with fireworks, parades, barbecues, carnivals, fairs, picnics, concerts, baseball games, family reunions, and political speeches and ceremonies, in addition to various other public and private events celebrating the history, government, and traditions of the United States. ',_react2.default.createElement('strong',null,'Independence Day'),' is the National Day of the United States.'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/Independence_Day_(United_States)'},'Learn more about Independence Day.')))));}}]);return IndependenceDay;}(_react2.default.Component);exports.default=IndependenceDay;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(38);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Labor Day","description":"Description of Labor Day.","date":"First Monday of September","month":"09"}}};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _holidayWrapper=__webpack_require__(7);var _holidayWrapper2=_interopRequireDefault(_holidayWrapper);var _holidayImage=__webpack_require__(8);var _holidayImage2=_interopRequireDefault(_holidayImage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Labor Day
description: Description of Labor Day.
date: First Monday of September
month: 09
---*/var LaborDay=function(_React$Component){_inherits(LaborDay,_React$Component);function LaborDay(){_classCallCheck(this,LaborDay);return _possibleConstructorReturn(this,(LaborDay.__proto__||Object.getPrototypeOf(LaborDay)).apply(this,arguments));}_createClass(LaborDay,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_holidayWrapper2.default,props,_react2.default.createElement(_holidayImage2.default,{src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/First_United_States_Labor_Day_Parade%2C_September_5%2C_1882_in_New_York_City.jpg/1600px-First_United_States_Labor_Day_Parade%2C_September_5%2C_1882_in_New_York_City.jpg'}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,_react2.default.createElement('strong',null,'Labor Day'),' in the United States is a public holiday celebrated on the first Monday in September. It honors the ',_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/Labor_history_of_the_United_States'},'American labor movement'),' and the contributions that workers have made to the strength, prosperity, laws and well-being of the country. It is the Monday of the long weekend known as ',_react2.default.createElement('strong',null,'Labor Day'),' Weekend and it is considered the unofficial end of summer in the United States. The holiday is also a federal holiday.'),_react2.default.createElement('p',null,'Beginning in the late 19th century, as the trade union and labor movements grew, trade unionists proposed that a day be set aside to celebrate labor. "',_react2.default.createElement('strong',null,'Labor Day'),'" was promoted by the Central Labor Union and the Knights of Labor, which organized the first parade in New York City. In 1887, Oregon was the first state of the United States to make it an official public holiday. By the time it became an official federal holiday in 1894, thirty U.S. states officially celebrated ',_react2.default.createElement('strong',null,'Labor Day'),'.'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/Labor_Day_(United_States)'},'Learn more about Labor Day.')))));}}]);return LaborDay;}(_react2.default.Component);exports.default=LaborDay;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(40);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Memorial Day","description":"Description of Memorial Day.","date":"Last Monday of May","month":5}}};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _holidayWrapper=__webpack_require__(7);var _holidayWrapper2=_interopRequireDefault(_holidayWrapper);var _holidayImage=__webpack_require__(8);var _holidayImage2=_interopRequireDefault(_holidayImage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Memorial Day
description: Description of Memorial Day.
date: Last Monday of May
month: 05
---*/// eslint-disable-line no-unused-vars
var MemorialDay=function(_React$Component){_inherits(MemorialDay,_React$Component);function MemorialDay(){_classCallCheck(this,MemorialDay);return _possibleConstructorReturn(this,(MemorialDay.__proto__||Object.getPrototypeOf(MemorialDay)).apply(this,arguments));}_createClass(MemorialDay,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_holidayWrapper2.default,props,_react2.default.createElement('div',null,_react2.default.createElement(_holidayImage2.default,{src:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Graves_at_Arlington_on_Memorial_Day.JPG/1024px-Graves_at_Arlington_on_Memorial_Day.JPG',style:{maxHeight:400}}),_react2.default.createElement('p',null,'          ',_react2.default.createElement('strong',null,'Memorial Day'),' is a federal holiday in the United States for remembering the people who died while serving in the ',_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/United_States_Armed_Forces'},'country\'s armed forces'),'. The holiday, which is currently observed every year on the last Monday of May, was held on May 29, 2017. The holiday was held on May 30 from 1868-1970. It marks the start of the unofficial summer vacation season, while Labor Day marks its end.'),_react2.default.createElement('p',null,'          Many people visit cemeteries and memorials, particularly to honor those who have died in military service. Many volunteers place an American flag on each grave in national cemeteries.'),_react2.default.createElement(_holidayImage2.default,{src:'https://upload.wikimedia.org/wikipedia/commons/b/b8/Gettysburg_national_cemetery_img_4164.jpg'}),_react2.default.createElement('p',null,'          ',_react2.default.createElement('strong',null,'Memorial Day'),' is not to be confused with Veterans Day; ',_react2.default.createElement('strong',null,'Memorial Day'),' is a day of remembering the men and women who died while serving, while Veterans Day celebrates the service of all U.S. military veterans.'),_react2.default.createElement('p',null,'          ',_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://en.wikipedia.org/wiki/Memorial_Day_(United_States)'},'Learn more about Memorial Day.')))));}}]);return MemorialDay;}(_react2.default.Component);exports.default=MemorialDay;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(42);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"Stories","description":"A collection of stories by Stephen Crane."}}};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _storiesData=__webpack_require__(15);var _storiesData2=_interopRequireDefault(_storiesData);var _pageShell=__webpack_require__(3);var _pageShell2=_interopRequireDefault(_pageShell);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: Stories
description: A collection of stories by Stephen Crane.
---*/var Stories=function(_React$Component){_inherits(Stories,_React$Component);function Stories(){_classCallCheck(this,Stories);return _possibleConstructorReturn(this,(Stories.__proto__||Object.getPrototypeOf(Stories)).apply(this,arguments));}_createClass(Stories,[{key:'render',value:function render(){var props=this.props;var storyItems=_storiesData2.default.map(function(story){return _react2.default.createElement('a',{key:story.path,className:'block py24 border-b border--gray-light link link--purple',href:story.path},_react2.default.createElement('div',{className:'txt-h3 mr12'},story.frontMatter.title),_react2.default.createElement('div',{className:'txt-em'},story.frontMatter.subtitle));});return _react2.default.createElement(_pageShell2.default,props,_react2.default.createElement('h1',{className:'txt-h1 txt-bold mb12'},'Stories!'),_react2.default.createElement('div',{className:'mb12'},'All by Stephen Crane.'),storyItems);}}]);return Stories;}(_react2.default.Component);exports.default=Stories;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(44);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"The Five White Mice","subtitle":"Oh, five white mice of chance, / Shirts of wool and corduroy pants ...","description":"A mouse story by Stephen Crane","date":"2014-08-11"}}};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(2);var _storyWrapper=__webpack_require__(4);var _storyWrapper2=_interopRequireDefault(_storyWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: The Five White Mice
subtitle: "Oh, five white mice of chance, / Shirts of wool and corduroy pants ..."
description: "A mouse story by Stephen Crane"
date: "2014-08-11"
---*/var frontMatter={title:'The Five White Mice',subtitle:'Oh, five white mice of chance, / Shirts of wool and corduroy pants ...',description:'A mouse story by Stephen Crane',date:'2014-08-11',headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_storyWrapper2.default,_extends({},props,{frontMatter:frontMatter}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,'Freddie was mixing a cock-tail. His hand with the long spoon was whirling swiftly, and the ice in the glass hummed and rattled like a cheap watch. Over by the window, a gambler, a millionaire, a railway conductor, and the agent of a vast American syndicate were playing seven-up. Freddie surveyed them with the ironical glance of a man who is mixing a cock-tail.'),_react2.default.createElement('p',null,'From time to time a swarthy Mexican waiter came with his tray from the rooms at the rear, and called his orders across the bar. The sounds of the indolent stir of the city, awakening from its siesta, floated over the screens which barred the sun and the inquisitive eye. From the far-away kitchen could be heard the roar of the old French chef, driving, herding, and abusing his Mexican helpers.'),_react2.default.createElement('p',null,'A string of men came suddenly in from the street. They stormed up to the bar. There were impatient shouts. "Come now, Freddie, don\'t stand there like a portrait of yourself. Wiggle!" Drinks of many kinds and colours, amber, green, mahogany, strong and mild, began to swarm upon the bar with all the attendants of lemon, sugar, mint and ice. Freddie, with Mexican support, worked like a sailor in the provision of them, sometimes talking with that scorn for drink and admiration for those who drink which is the attribute of a good bar-keeper.'),_react2.default.createElement('p',null,'At last a man was afflicted with a stroke of dice-shaking. A herculean discussion was waging, and he was deeply engaged in it, but at the same time he lazily flirted the dice. Occasionally he made great combinations. "Look at that, would you?" he cried proudly. The others paid little heed. Then violently the craving took them. It went along the line like an epidemic, and involved them all. In a moment they had arranged a carnival of dice-shaking with money penalties and liquid prizes. They clamorously made it a point of honour with Freddie that he should play and take his chance of sometimes providing this large group with free refreshment. With bended heads like football players, they surged over the tinkling dice, jostling, cheering, and bitterly arguing. One of the quiet company playing seven-up at the corner table said profanely that the row reminded him of a bowling contest at a picnic.'),_react2.default.createElement('p',null,'After the regular shower, many carriages rolled over the smooth calle, and sent a musical thunder through the Casa Verde. The shop-windows became aglow with light, and the walks were crowded with youths, callow and ogling, dressed vainly according to superstitious fashions. The policemen had muffled themselves in their gnome-like cloaks, and placed their lanterns as obstacles for the carriages in the middle of the street. The city of Mexico gave forth the deep organ-mellow tones of its evening resurrection.'),_react2.default.createElement('p',null,'But still the group at the bar of the Casa Verde were shaking dice. They had passed beyond shaking for drinks for the crowd, for Mexican dollars, for dinners, for the wine at dinner. They had even gone to the trouble of separating the cigars and cigarettes from the dinner\'s bill, and causing a distinct man to be responsible for them. Finally they were aghast. Nothing remained in sight of their minds which even remotely suggested further gambling. There was a pause for deep consideration.'),_react2.default.createElement('p',null,"\"Well\u2014\u2014\""),_react2.default.createElement('p',null,"\"Well\u2014\u2014\""),_react2.default.createElement('p',null,"A man called out in the exuberance of creation. \"I know! Let's shake for a box to-night at the circus! A box at the circus!\" The group was profoundly edified. \"That's it! That's it! Come on now! Box at the circus!\" A dominating voice cried\u2014\"Three dashes\u2014high man out!\" An American, tall, and with a face of copper red from the rays that flash among the Sierra Madres and burn on the cactus deserts, took the little leathern cup and spun the dice out upon the polished wood. A fascinated assemblage hung upon the bar-rail. Three kings turned their pink faces upward. The tall man flourished the cup, burlesquing, and flung the two other dice. From them he ultimately extracted one more pink king. \"There,\" he said. \"Now, let's see! Four kings!\" He began to swagger in a sort of provisional way."),_react2.default.createElement('p',null,"The next man took the cup, and blew softly in the top of it. Poising it in his hand, he then surveyed the company with a stony eye and paused. They knew perfectly well that he was applying the magic of deliberation and ostentatious indifference, but they could not wait in tranquillity during the performance of all these rites. They began to call out impatiently. \"Come now\u2014hurry up.\" At last the man, with a gesture that was singularly impressive, threw the dice. The others set up a howl of joy. \"Not a pair!\" There was another solemn pause. The men moved restlessly. \"Come, now, go ahead!\" In the end, the man, induced and abused, achieved something that was nothing in the presence of four kings. The tall man climbed on the foot-rail and leaned hazardously forward. \"Four kings! My four kings are good to go out,\" he bellowed into the middle of the mob, and although in a moment he did pass into the radiant region of exemption, he continued to bawl advice and scorn."),_react2.default.createElement('p',null,'The mirrors and oiled woods of the Casa Verde were now dancing with blue flashes from a great buzzing electric lamp. A host of quiet members of the Anglo-Saxon colony had come in for their pre-dinner cock-tails. An amiable person was exhibiting to some tourists this popular American saloon. It was a very sober and respectable time of day. Freddie reproved courageously the dice-shaking brawlers, and, in return, he received the choicest advice in a tumult of seven combined vocabularies. He laughed; he had been compelled to retire from the game, but he was keeping an interested, if furtive, eye upon it.'),_react2.default.createElement('p',null,'Down at the end of the line there was a youth at whom everybody railed for his flaming ill-luck. At each disaster, Freddie swore from behind the bar in a sort of affectionate contempt. "Why, this kid has had no luck for two days. Did you ever see such throwin\'?"'),_react2.default.createElement('p',null,'The contest narrowed eventually to the New York kid and an individual who swung about placidly on legs that moved in nefarious circles. He had a grin that resembled a bit of carving. He was obliged to lean down and blink rapidly to ascertain the facts of his venture, but fate presented him with five queens. His smile did not change, but he puffed gently like a man who has been running.'),_react2.default.createElement('p',null,'...'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://www.gutenberg.org/files/45524/45524-h/45524-h.htm#The-Five-White-Mice'},'Read the rest of this story on Project Gutenberg.')))));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=getLegibleDate;function getLegibleDate(machineDate){var splitString=new Date(machineDate).toString().split(' ');return splitString.slice(1,3).join(' ')+', '+splitString[3];}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(47);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"A Great Mistake","description":"Stephen Crane's story of a great mistake.","date":"2017-12-13"}}};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(2);var _storyWrapper=__webpack_require__(4);var _storyWrapper2=_interopRequireDefault(_storyWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: A Great Mistake
description: "Stephen Crane's story of a great mistake."
date: "2017-12-13"
---*/var frontMatter={title:'A Great Mistake',description:'Stephen Crane\'s story of a great mistake.',date:'2017-12-13',headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_storyWrapper2.default,_extends({},props,{frontMatter:frontMatter}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,'An Italian kept a fruit-stand on a corner where he had good aim at the people who came down from the elevated station, and at those who went along two thronged streets. He sat most of the day in a backless chair that was placed strategically.'),_react2.default.createElement('p',null,'There was a babe living hard by, up five flights of stairs, who regarded this Italian as a tremendous being. The babe had investigated this fruit-stand. It had thrilled him as few things he had met with in his travels had thrilled him. The sweets of the world had laid there in dazzling rows, tumbled in luxurious heaps. When he gazed at this Italian seated amid such splendid treasures, his lower lip hung low and his eyes, raised to the vendor\'s face, were filled with deep respect, worship, as if he saw omnipotence.'),_react2.default.createElement('p',null,'The babe came often to this corner. He hovered about the stand and watched each detail of the business. He was fascinated by the tranquillity of the vendor, the majesty of power and possession. At times he was so engrossed in his contemplation that people, hurrying, had to use care to avoid bumping him down.'),_react2.default.createElement('p',null,'He had never ventured very near to the stand. It was his habit to hang warily about the curb. Even there he resembled a babe who looks unbidden at a feast of gods.'),_react2.default.createElement('p',null,'One day, however, as the baby was thus staring, the vendor arose, and going along the front of the stand, began to polish oranges with a red pocket handkerchief. The breathless spectator moved across the side walk until his small face almost touched the vendor\'s sleeve. His fingers were gripped in a fold of his dress.'),_react2.default.createElement('p',null,'At last, the Italian finished with the oranges and returned to his chair. He drew a newspaper printed in his language from behind a bunch of bananas. He settled himself in a comfortable position, and began to glare savagely at the print. The babe was left face to face with the massed joys of the world. For a time he was a simple worshipper at this golden shrine. Then tumultuous desires began to shake him. His dreams were of conquest. His lips moved. Presently into his head there came a little plan. He sidled nearer, throwing swift and cunning glances at the Italian. He strove to maintain his conventional manner, but the whole plot was written upon his countenance.'),_react2.default.createElement('p',null,'At last he had come near enough to touch the fruit. From the tattered skirt came slowly his small dirty hand. His eyes were still fixed upon the vendor. His features were set, save for the under lip, which had a faint fluttering movement. The hand went forward.'),_react2.default.createElement('p',null,'Elevated trains thundered to the station and the stairway poured people upon the sidewalks. There was a deep sea roar from feet and wheels going ceaselessly. None seemed to perceive the babe engaged in a great venture.'),_react2.default.createElement('p',null,'The Italian turned his paper. Sudden panic smote the babe. His hand dropped, and he gave vent to a cry of dismay. He remained for a moment staring at the vendor. There was evidently a great debate in his mind. His infant intellect had defined this Italian. The latter was undoubtedly a man who would eat babes that provoked him. And the alarm in the babe when this monarch had turned his newspaper brought vividly before him the consequences if he were detected. But at this moment the vendor gave a blissful grunt, and tilting his chair against a wall, closed his eyes. His paper dropped unheeded.'),_react2.default.createElement('p',null,'The babe ceased his scrutiny and again raised his hand. It was moved with supreme caution toward the fruit. The fingers were bent, claw-like, in the manner of great heart-shaking greed. Once he stopped and chattered convulsively, because the vendor moved in his sleep. The babe, with his eyes still upon the Italian, again put forth his hand, and the rapacious fingers closed over a round bulb.'),_react2.default.createElement('p',null,'And it was written that the Italian should at this moment open his eyes. He glared at the babe a fierce question. Thereupon the babe thrust the round bulb behind him, and with a face expressive of the deepest guilt, began a wild but elaborate series of gestures declaring his innocence. The Italian howled. He sprang to his feet, and with three steps overtook the babe. He whirled him fiercely, and took from the little fingers a lemon.'),_react2.default.createElement('p',null,'...'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://www.gutenberg.org/files/45524/45524-h/45524-h.htm#A-Great-Mistake'},'Read the rest of this story on Project Gutenberg.')))));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(49);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"An Ominous Baby","description":"Stephen Crane's story of an ominous baby.","date":"2014-11-12"}}};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(2);var _storyWrapper=__webpack_require__(4);var _storyWrapper2=_interopRequireDefault(_storyWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: An Ominous Baby
description: "Stephen Crane's story of an ominous baby."
date: "2014-11-12"
---*/var frontMatter={title:'An Ominous Baby',description:'Stephen Crane\'s story of an ominous baby.',date:'2014-11-12',headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_storyWrapper2.default,_extends({},props,{frontMatter:frontMatter}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,'A baby was wandering in a strange country. He was a tattered child with a frowsled wealth of yellow hair. His dress, of a checked stuff, was soiled, and showed the marks of many conflicts, like the chain-shirt of a warrior. His sun-tanned knees shone above wrinkled stockings, which he pulled up occasionally with an impatient movement when they entangled his feet. From a gaping shoe there appeared an array of tiny toes.'),_react2.default.createElement('p',null,'He was toddling along an avenue between rows of stolid brown houses. He went slowly, with a look of absorbed interest on his small flushed face. His blue eyes stared curiously. Carriages went with a musical rumble over the smooth asphalt. A man with a chrysanthemum was going up steps. Two nursery maids chatted as they walked slowly, while their charges hobnobbed amiably between perambulators. A truck wagon roared thunderously in the distance.'),_react2.default.createElement('p',null,'The child from the poor district made his way along the brown street filled with dull grey shadows. High up, near the roofs, glancing sun-rays changed cornices to blazing gold and silvered the fronts of windows. The wandering baby stopped and stared at the two children laughing and playing in their carriages among the heaps of rugs and cushions. He braced his legs apart in an attitude of earnest attention. His lower jaw fell, and disclosed his small, even teeth. As they moved on, he followed the carriages with awe in his face as if contemplating a pageant. Once one of the babies, with twittering laughter, shook a gorgeous rattle at him. He smiled jovially in return.'),_react2.default.createElement('p',null,'Finally a nursery maid ceased conversation and, turning, made a gesture of annoyance.'),_react2.default.createElement('p',null,'"Go \'way, little boy," she said to him. "Go \'way. You\'re all dirty."'),_react2.default.createElement('p',null,'He gazed at her with infant tranquillity for a moment, and then went slowly off dragging behind him a bit of rope he had acquired in another street. He continued to investigate the new scenes. The people and houses struck him with interest as would flowers and trees. Passengers had to avoid the small, absorbed figure in the middle of the sidewalk. They glanced at the intent baby face covered with scratches and dust as with scars and with powder smoke.'),_react2.default.createElement('p',null,'...'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://www.gutenberg.org/files/45524/45524-h/45524-h.htm#An-Ominous-Baby'},'Read the rest of this story on Project Gutenberg.')))));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(51);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"The Open Boat","subtitle":"A tale intended to be after the fact. Being the experience of four men from the sunk steamer 'Commodore'.","description":"The first part of a story by Stephen Crane","date":"2014-09-11"}}};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(2);var _storyWrapper=__webpack_require__(4);var _storyWrapper2=_interopRequireDefault(_storyWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: The Open Boat
subtitle: "A tale intended to be after the fact. Being the experience of four men from the sunk steamer 'Commodore'."
description: "The first part of a story by Stephen Crane"
date: "2014-09-11"
---*/var frontMatter={title:'The Open Boat',subtitle:'A tale intended to be after the fact. Being the experience of four men from the sunk steamer \'Commodore\'.',description:'The first part of a story by Stephen Crane',date:'2014-09-11',headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_storyWrapper2.default,_extends({},props,{frontMatter:frontMatter}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,'None of them knew the colour of the sky. Their eyes glanced level, and were fastened upon the waves that swept toward them. These waves were of the hue of slate, save for the tops, which were of foaming white, and all of the men knew the colours of the sea. The horizon narrowed and widened, and dipped and rose, and at all times its edge was jagged with waves that seemed thrust up in points like rocks.'),_react2.default.createElement('p',null,'Many a man ought to have a bath-tub larger than the boat which here rode upon the sea. These waves were most wrongfully and barbarously abrupt and tall, and each froth-top was a problem in small boat navigation.'),_react2.default.createElement('p',null,'The cook squatted in the bottom and looked with both eyes at the six inches of gunwale which separated him from the ocean. His sleeves were rolled over his fat forearms, and the two flaps of his unbuttoned vest dangled as he bent to bail out the boat. Often he said: "Gawd! That was a narrow clip." As he remarked it he invariably gazed eastward over the broken sea.'),_react2.default.createElement('p',null,'The oiler, steering with one of the two oars in the boat, sometimes raised himself suddenly to keep clear of water that swirled in over the stern. It was a thin little oar and it seemed often ready to snap.'),_react2.default.createElement('p',null,'The correspondent, pulling at the other oar, watched the waves and wondered why he was there.'),_react2.default.createElement('p',null,'The injured captain, lying in the bow, was at this time buried in that profound dejection and indifference which comes, temporarily at least, to even the bravest and most enduring when, willy nilly, the firm fails, the army loses, the ship goes down. The mind of the master of a vessel is rooted deep in the timbers of her, though he commanded for a day or a decade, and this captain had on him the stern impression of a scene in the greys of dawn of seven turned faces, and later a stump of a top-mast with a white ball on it that slashed to and fro at the waves, went low and lower, and down. Thereafter there was something strange in his voice. Although steady, it was deep with mourning, and of a quality beyond oration or tears.'),_react2.default.createElement('p',null,'"Keep \'er a little more south, Billie," said he.'),_react2.default.createElement('p',null,'"\'A little more south,\' sir," said the oiler in the stern.'),_react2.default.createElement('p',null,'A seat in this boat was not unlike a seat upon a bucking broncho, and, by the same token, a broncho is not much smaller. The craft pranced and reared, and plunged like an animal. As each wave came, and she rose for it, she seemed like a horse making at a fence outrageously high. The manner of her scramble over these walls of water is a mystic thing, and, moreover, at the top of them were ordinarily these problems in white water, the foam racing down from the summit of each wave, requiring a new leap, and a leap from the air. Then, after scornfully bumping a crest, she would slide, and race, and splash down a long incline, and arrive bobbing and nodding in front of the next menace.'),_react2.default.createElement('p',null,'A singular disadvantage of the sea lies in the fact that after successfully surmounting one wave you discover that there is another behind it just as important and just as nervously anxious to do something effective in the way of swamping boats. In a ten-foot dingey one can get an idea of the resources of the sea in the line of waves that is not probable to the average experience which is never at sea in a dingey. As each slaty wall of water approached, it shut all else from the view of the men in the boat, and it was not difficult to imagine that this particular wave was the final outburst of the ocean, the last effort of the grim water. There was a terrible grace in the move of the waves, and they came in silence, save for the snarling of the crests.'),_react2.default.createElement('p',null,'In the wan light, the faces of the men must have been grey. Their eyes must have glinted in strange ways as they gazed steadily astern. Viewed from a balcony, the whole thing would doubtlessly have been weirdly picturesque. But the men in the boat had no time to see it, and if they had had leisure there were other things to occupy their minds. The sun swung steadily up the sky, and they knew it was broad day because the colour of the sea changed from slate to emerald-green, streaked with amber lights, and the foam was like tumbling snow. The process of the breaking day was unknown to them. They were aware only of this effect upon the colour of the waves that rolled toward them.'),_react2.default.createElement('p',null,'In disjointed sentences the cook and the correspondent argued as to the difference between a life-saving station and a house of refuge. The cook had said: "There\'s a house of refuge just north of the Mosquito Inlet Light, and as soon as they see us, they\'ll come off in their boat and pick us up."'),_react2.default.createElement('p',null,'"As soon as who see us?" said the correspondent.'),_react2.default.createElement('p',null,'"The crew," said the cook.'),_react2.default.createElement('p',null,'"Houses of refuge don\'t have crews," said the correspondent. "As I understand them, they are only places where clothes and grub are stored for the benefit of shipwrecked people. They don\'t carry crews."'),_react2.default.createElement('p',null,'"Oh, yes, they do," said the cook.'),_react2.default.createElement('p',null,'"No, they don\'t," said the correspondent.'),_react2.default.createElement('p',null,'"Well, we\'re not there yet, anyhow," said the oiler, in the stern.'),_react2.default.createElement('p',null,'"Well," said the cook, "perhaps it\'s not a house of refuge that I\'m thinking of as being near Mosquito Inlet Light. Perhaps it\'s a life-saving station."'),_react2.default.createElement('p',null,'"We\'re not there yet," said the oiler, in the stern.'),_react2.default.createElement('p',null,'...'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://www.gutenberg.org/files/45524/45524-h/45524-h.htm#The-Open-Boat'},'Read the rest of this story on Project Gutenberg.')))));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Page=__webpack_require__(53);Page=Page.default||Page;module.exports={component:Page,props:{"frontMatter":{"title":"The Wise Men","description":"A story by Stephen Crane about youths with subtle minds.","date":"2014-10-11"}}};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _prefixUrl=__webpack_require__(1);var _routeTo=__webpack_require__(2);var _storyWrapper=__webpack_require__(4);var _storyWrapper2=_interopRequireDefault(_storyWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&((typeof call==="undefined"?"undefined":_typeof(call))==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+(typeof superClass==="undefined"?"undefined":_typeof(superClass)));}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}/*---
title: The Wise Men
description: "A story by Stephen Crane about youths with subtle minds."
date: "2014-10-11"
---*/var frontMatter={title:'The Wise Men',description:'A story by Stephen Crane about youths with subtle minds.',date:'2014-10-11',headings:[]};var MarkdownReact=function(_React$PureComponent){_inherits(MarkdownReact,_React$PureComponent);function MarkdownReact(){_classCallCheck(this,MarkdownReact);return _possibleConstructorReturn(this,(MarkdownReact.__proto__||Object.getPrototypeOf(MarkdownReact)).apply(this,arguments));}_createClass(MarkdownReact,[{key:'render',value:function render(){var props=this.props;return _react2.default.createElement(_storyWrapper2.default,_extends({},props,{frontMatter:frontMatter}),_react2.default.createElement('div',null,_react2.default.createElement('p',null,'They were youths of subtle mind. They were very wicked according to report, and yet they managed to have it reflect great credit upon them. They often had the well-informed and the great talkers of the American colony engaged in reciting their misdeeds, and facts relating to their sins were usually told with a flourish of awe and fine admiration.'),_react2.default.createElement('p',null,'One was from San Francisco and one was from New York, but they resembled each other in appearance. This is an idiosyncrasy of geography.'),_react2.default.createElement('p',null,'They were never apart in the City of Mexico, at any rate, excepting perhaps when one had retired to his hotel for a respite, and then the other was usually camped down at the office sending up servants with clamorous messages. "Oh, get up and come on down."'),_react2.default.createElement('p',null,"They were two lads\u2014they were called the kids\u2014and far from their mothers. Occasionally some wise man pitied them, but he usually was alone in his wisdom. The other folk frankly were transfixed at the splendour of the audacity and endurance of these kids."),_react2.default.createElement('p',null,'"When do those boys ever sleep?" murmured a man as he viewed them entering a caf\xE9 about eight o\'clock one morning. Their smooth infantile faces looked bright and fresh enough, at any rate. "Jim told me he saw them still at it about 4.30 this morning."'),_react2.default.createElement('p',null,'"Sleep!" ejaculated a companion in a glowing voice. "They never sleep! They go to bed once in every two weeks." His boast of it seemed almost a personal pride.'),_react2.default.createElement('p',null,'"They\'ll end with a crash, though, if they keep it up at this pace," said a gloomy voice from behind a newspaper.'),_react2.default.createElement('p',null,"The Caf\xE9 Colorado has a front of white and gold, in which is set larger plate-glass windows than are commonly to be found in Mexico. Two little wings of willow flip-flapping incessantly serve as doors. Under them small stray dogs go furtively into the caf\xE9, and are shied into the street again by the waiters. On the side-walk there is always a decorative effect of loungers, ranging from the newly-arrived and superior tourist to the old veteran of the silver mines bronzed by violent suns. They contemplate with various shades of interest the show of the street\u2014the red, purple, dusty white, glaring forth against the walls in the furious sunshine."),_react2.default.createElement('p',null,'One afternoon the kids strolled into the Caf\xE9 Colorado. A half-dozen of the men who sat smoking and reading with a sort of Parisian effect at the little tables which lined two sides of the room, looked up and bowed smiling, and although this coming of the kids was anything but an unusual event, at least a dozen men wheeled in their chairs to stare after them. Three waiters polished tables, and moved chairs noisily, and appeared to be eager. Distinctly these kids were of importance.'),_react2.default.createElement('p',null,'Behind the distant bar, the tall form of old Pop himself awaited them smiling with broad geniality. "Well, my boys, how are you?" he cried in a voice of profound solicitude. He allowed five or six of his customers to languish in the care of Mexican bartenders, while he himself gave his eloquent attention to the kids, lending all the dignity of a great event to their arrival. "How are the boys to-day, eh?"'),_react2.default.createElement('p',null,'"You\'re a smooth old guy," said one, eying him. "Are you giving us this welcome so we won\'t notice it when you push your worst whisky at us?"'),_react2.default.createElement('p',null,'Pop turned in appeal from one kid to the other kid. "There, now, hear that, will you?" He assumed an oratorical pose. "Why, my boys, you always get the best that this house has got."'),_react2.default.createElement('p',null,'"Yes, we do!" The kids laughed. "Well, bring it out, anyhow, and if it\'s the same you sold us last night, we\'ll grab your cash register and run."'),_react2.default.createElement('p',null,'Pop whirled a bottle along the bar and then gazed at it with a rapt expression. "Fine as silk," he murmured. "Now just taste that, and if it isn\'t the best whisky you ever put in your face, why I\'m a liar, that\'s all."'),_react2.default.createElement('p',null,'The kids surveyed him with scorn, and poured their allowances. Then they stood for a time insulting Pop about his whisky. "Usually it tastes exactly like new parlour furniture," said the San Francisco kid. "Well, here goes, and you want to look out for your cash register."'),_react2.default.createElement('p',null,'"Your health, gentlemen," said Pop with a grand air, and as he wiped his bristling grey moustaches he wagged his head with reference to the cash register question. "I could catch you before you got very far."'),_react2.default.createElement('p',null,'"Why, are you a runner?" said one derisively.'),_react2.default.createElement('p',null,'"You just bank on me, my boy," said Pop, with deep emphasis. "I\'m a flier."'),_react2.default.createElement('p',null,'...'),_react2.default.createElement('p',null,_react2.default.createElement('strong',null,_react2.default.createElement('a',{href:'https://www.gutenberg.org/files/45524/45524-h/45524-h.htm#The-Wise-Men'},'Read the rest of this story on Project Gutenberg.')))));}}]);return MarkdownReact;}(_react2.default.PureComponent);exports.default=MarkdownReact;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
var fs=__webpack_require__(10);var UglifyJs=__webpack_require__(55);function renderInlineJsScripts(inlineJsEntries){if(!inlineJsEntries){return'';}return inlineJsEntries.map(function(jsData){var code=fs.readFileSync(jsData.filename,'utf8');if(jsData.uglify!==false){var uglified=UglifyJs.minify(code);if(uglified.error)throw uglified.error;code=uglified.code;}return'<script>'+code+'</script>';}).join('\n');}module.exports=renderInlineJsScripts;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/uglify-js/tools/node.js");

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.renderHtmlPage=renderHtmlPage;var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _server=__webpack_require__(57);var _server2=_interopRequireDefault(_server);var _reactHelmet=__webpack_require__(11);var _reactHelmet2=_interopRequireDefault(_reactHelmet);var _batfishApp=__webpack_require__(58);var _batfishSpaApp=__webpack_require__(65);var _staticHtmlPage=__webpack_require__(66);var _constants=__webpack_require__(67);var _constants2=_interopRequireDefault(_constants);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function renderHtmlPage(options){return options.route.getPage().then(function(pageModule){// We render the page content separately from the StaticHtmlPage, because
// the page content is what will be re-rendered when the bundled JS loads
// so it must match exactly what batfish-app.js renders (or you get React
// checksum errors). The rest of StaticHtmlPage will never be re-rendered
// by React.
var pageContent=void 0;if(options.spa){pageContent=_react2.default.createElement(_batfishSpaApp.BatfishSpaApp,{pageModule:pageModule});}else{pageContent=_react2.default.createElement(_batfishApp.BatfishApp,{startingPath:options.route.path,pageModule:pageModule});}var rawAppHtml=_server2.default.renderToString(pageContent);var helmetHead=_reactHelmet2.default.rewind();var reactDocument=_react2.default.createElement(_staticHtmlPage.StaticHtmlPage,{rawAppHtml:rawAppHtml,htmlAttributes:helmetHead.htmlAttributes.toComponent(),bodyAttributes:helmetHead.bodyAttributes.toComponent(),appendToHead:[helmetHead.title.toString(),helmetHead.base.toString(),helmetHead.meta.toString(),helmetHead.link.toString(),options.inlineJsScripts,helmetHead.script.toString(),_constants2.default.INLINE_CSS_MARKER,options.css,// This comes after the inlined and dynamically loaded CSS
// so it will override regular stylesheets
helmetHead.style.toString()],appendToBody:options.appendToBody});var html=_server2.default.renderToStaticMarkup(reactDocument);return'<!doctype html>'+html;});}//

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.BatfishApp=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _router=__webpack_require__(59);var _applicationWrapper=__webpack_require__(20);var _applicationWrapper2=_interopRequireDefault(_applicationWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var BatfishApp=exports.BatfishApp=function(_React$Component){_inherits(BatfishApp,_React$Component);function BatfishApp(){_classCallCheck(this,BatfishApp);return _possibleConstructorReturn(this,(BatfishApp.__proto__||Object.getPrototypeOf(BatfishApp)).apply(this,arguments));}_createClass(BatfishApp,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){return _react2.default.createElement(_applicationWrapper2.default,null,_react2.default.createElement(_router.Router,{startingPath:this.props.startingPath,startingComponent:this.props.pageModule.component,startingProps:this.props.pageModule.props}));}}]);return BatfishApp;}(_react2.default.Component);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.Router=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _propTypes=__webpack_require__(5);var _propTypes2=_interopRequireDefault(_propTypes);var _linkHijacker=__webpack_require__(60);var _linkHijacker2=_interopRequireDefault(_linkHijacker);var _scrollRestorer=__webpack_require__(16);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _linkToLocation=__webpack_require__(61);var _linkToLocation2=_interopRequireDefault(_linkToLocation);var _querySelectorContainsNode=__webpack_require__(62);var _querySelectorContainsNode2=_interopRequireDefault(_querySelectorContainsNode);var _context=__webpack_require__(6);var _routeTo=__webpack_require__(2);var _prefixUrl=__webpack_require__(1);var _findMatchingRoute=__webpack_require__(17);var _scrollToFragment=__webpack_require__(18);var _getWindow=__webpack_require__(9);var _changePage=__webpack_require__(63);var _getCurrentLocation=__webpack_require__(19);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var _batfishContext$selec=_context.batfishContext.selectedConfig,siteBasePath=_batfishContext$selec.siteBasePath,siteOrigin=_batfishContext$selec.siteOrigin,manageScrollRestoration=_batfishContext$selec.manageScrollRestoration,hijackLinks=_batfishContext$selec.hijackLinks;// See explanation for this weirdness in prefix-url.js.
// This happens outside the component lifecycle so it can be used during
// rendering of HTML.
_prefixUrl.prefixUrl._configure(siteBasePath,siteOrigin);var Router=function(_React$PureComponent){_inherits(Router,_React$PureComponent);function Router(props){_classCallCheck(this,Router);var _this=_possibleConstructorReturn(this,(Router.__proto__||Object.getPrototypeOf(Router)).call(this,props));_this.routeTo=function(input){var win=(0,_getWindow.getWindow)();var targetLocation=(0,_linkToLocation2.default)(input);if((0,_findMatchingRoute.findMatchingRoute)(targetLocation.pathname).is404){return win.location.assign(input);}(0,_changePage.changePage)(targetLocation,_this.setState.bind(_this),{pushState:true,scrollToTop:win.location.pathname!==targetLocation.pathname||!targetLocation.hash});};var location={pathname:_this.props.startingPath};if(typeof window!=='undefined'){var win=(0,_getWindow.getWindow)();location.search=win.location.search;location.hash=win.location.hash;}_this.state={path:_this.props.startingPath,PageComponent:_this.props.startingComponent,pageProps:_this.props.startingProps,location:location};return _this;}_createClass(Router,[{key:'getChildContext',value:function getChildContext(){return{location:this.state.location};}},{key:'componentDidMount',value:function componentDidMount(){var _this2=this;if(manageScrollRestoration){_scrollRestorer2.default.start({autoRestore:false});}var win=(0,_getWindow.getWindow)();if(!win.location.hash&&manageScrollRestoration){_scrollRestorer2.default.restoreScroll();}else{(0,_scrollToFragment.scrollToFragment)();}_routeTo.routeTo._setRouteToHandler(this.routeTo);win.addEventListener('popstate',function(event){event.preventDefault();(0,_changePage.changePage)({pathname:win.location.pathname,search:win.location.search,hash:win.location.hash},_this2.setState.bind(_this2));});if(hijackLinks){_linkHijacker2.default.hijack({skipFilter:function skipFilter(link){return(0,_querySelectorContainsNode2.default)('[data-batfish-no-hijack]',link);}},this.routeTo);}this.setState({location:(0,_getCurrentLocation.getCurrentLocation)()});}// Converts input to a location object.
// If it matches a route, go there dynamically and scroll to the top of the viewport.
// If it doesn't match a route, go there non-dynamically.
},{key:'render',value:function render(){var PageComponent=this.state.PageComponent;if(!PageComponent)return null;return _react2.default.createElement(PageComponent,_extends({location:this.state.location},this.state.pageProps));}}]);return Router;}(_react2.default.PureComponent);Router.childContextTypes={location:_propTypes2.default.shape({pathname:_propTypes2.default.string.isRequired,hash:_propTypes2.default.string,search:_propTypes2.default.string}).isRequired};exports.Router=Router;

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/link-hijacker/index.js");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("/Users/dan/Documents/github/batfish/node_modules/@mapbox/link-to-location/index.js");

/***/ }),
/* 62 */
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.changePage=changePage;var _scrollRestorer=__webpack_require__(16);var _scrollRestorer2=_interopRequireDefault(_scrollRestorer);var _findMatchingRoute=__webpack_require__(17);var _scrollToFragment=__webpack_require__(18);var _routeChangeListeners=__webpack_require__(64);var _getCurrentLocation=__webpack_require__(19);var _getWindow=__webpack_require__(9);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}//      
function changePage(nextLocation,setRouterState){var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};var onFinish=arguments[3];var win=(0,_getWindow.getWindow)();var matchingRoute=(0,_findMatchingRoute.findMatchingRoute)(nextLocation.pathname);var nextUrl=[nextLocation.pathname,nextLocation.hash,nextLocation.search].join('');// Call the change-start callbacks immediately, not after the page chunk
// has already been fetched.
var startChange=(0,_routeChangeListeners._invokeRouteChangeStartCallbacks)(nextLocation.pathname);return matchingRoute.getPage().then(function(pageModule){return startChange.then(function(){return pageModule;});}).then(function(pageModule){if(options.pushState){win.history.pushState({},null,nextUrl);}var nextState={path:matchingRoute.path,PageComponent:pageModule.component,pageProps:pageModule.props,location:(0,_getCurrentLocation.getCurrentLocation)()};setRouterState(nextState,function(){if(nextLocation.hash){(0,_scrollToFragment.scrollToFragment)();}else if(options.scrollToTop){win.scrollTo(0,0);}else if(_scrollRestorer2.default.getSavedScroll()){_scrollRestorer2.default.restoreScroll();}if(onFinish)onFinish();(0,_routeChangeListeners._invokeRouteChangeEndCallbacks)(nextLocation.pathname);});});}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.invokeCallbacks=invokeCallbacks;exports.addRouteChangeStartListener=addRouteChangeStartListener;exports.removeRouteChangeStartListener=removeRouteChangeStartListener;exports.addRouteChangeEndListener=addRouteChangeEndListener;exports.removeRouteChangeEndListener=removeRouteChangeEndListener;exports._invokeRouteChangeStartCallbacks=_invokeRouteChangeStartCallbacks;exports._invokeRouteChangeEndCallbacks=_invokeRouteChangeEndCallbacks;var _prefixUrl=__webpack_require__(1);function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}//      
var ALL_PATHS='*';var startListeners=_defineProperty({},ALL_PATHS,[]);var endListeners=_defineProperty({},ALL_PATHS,[]);function normalizePathname(pathname){if(pathname!==ALL_PATHS&&!(0,_prefixUrl.isUrlPrefixed)(pathname)){pathname=(0,_prefixUrl.prefixUrl)(pathname);}return pathname.replace(/\/$/,'');}function addListener(pathnameOrListener,maybeListener,registry,remover){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!registry[pathname]){registry[pathname]=[];}registry[pathname].push(listener||noop);return function(){return remover(pathname,listener);};}function removeListener(pathnameOrListener,maybeListener,registry){var listener=void 0;var pathname=void 0;if(typeof pathnameOrListener==='function'||!pathnameOrListener){listener=pathnameOrListener;pathname=ALL_PATHS;}else{listener=maybeListener;pathname=pathnameOrListener;}pathname=normalizePathname(pathname);if(!listener){registry[pathname]=[];return;}var listeners=registry[pathname];for(var i=0,l=listeners.length;i<l;i++){if(listeners[i]===listener){listeners.splice(i,1);return;}}}function invokeCallbacks(nextPathname,registery){nextPathname=normalizePathname(nextPathname);var promisesToKeep=[Promise.resolve()];if(registery[nextPathname]){registery[nextPathname].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});}registery[ALL_PATHS].forEach(function(callback){promisesToKeep.push(Promise.resolve(callback(nextPathname)));});return Promise.all(promisesToKeep);}function addRouteChangeStartListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,startListeners,removeRouteChangeStartListener);}function removeRouteChangeStartListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,startListeners);}function addRouteChangeEndListener(pathnameOrListener,maybeListener){return addListener(pathnameOrListener,maybeListener,endListeners,removeRouteChangeEndListener);}function removeRouteChangeEndListener(pathnameOrListener,maybeListener){removeListener(pathnameOrListener,maybeListener,endListeners);}function _invokeRouteChangeStartCallbacks(nextPathname){return invokeCallbacks(nextPathname,startListeners);}function _invokeRouteChangeEndCallbacks(nextPathname){return invokeCallbacks(nextPathname,endListeners);}function noop(){}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.BatfishSpaApp=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);var _applicationWrapper=__webpack_require__(20);var _applicationWrapper2=_interopRequireDefault(_applicationWrapper);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
var BatfishSpaApp=exports.BatfishSpaApp=function(_React$Component){_inherits(BatfishSpaApp,_React$Component);function BatfishSpaApp(){_classCallCheck(this,BatfishSpaApp);return _possibleConstructorReturn(this,(BatfishSpaApp.__proto__||Object.getPrototypeOf(BatfishSpaApp)).apply(this,arguments));}_createClass(BatfishSpaApp,[{key:'shouldComponentUpdate',value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var body=_react2.default.createElement(this.props.pageModule.component,this.props.pageModule.props);return _react2.default.createElement(_applicationWrapper2.default,null,body);}}]);return BatfishSpaApp;}(_react2.default.Component);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.StaticHtmlPage=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _react=__webpack_require__(0);var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}//      
// This component is used by static-render-pages to create an HTML document.
var StaticHtmlPage=function(_React$Component){_inherits(StaticHtmlPage,_React$Component);function StaticHtmlPage(){_classCallCheck(this,StaticHtmlPage);return _possibleConstructorReturn(this,(StaticHtmlPage.__proto__||Object.getPrototypeOf(StaticHtmlPage)).apply(this,arguments));}_createClass(StaticHtmlPage,[{key:'shouldComponentUpdate',// This should never be updated by React
value:function shouldComponentUpdate(){return false;}},{key:'render',value:function render(){var head=null;if(this.props.appendToHead){head=_react2.default.createElement('head',{dangerouslySetInnerHTML:{__html:this.props.appendToHead.join('\n')}});}var appendToBody=null;if(this.props.appendToBody){appendToBody=_react2.default.createElement('div',{dangerouslySetInnerHTML:{__html:this.props.appendToBody.join('\n')}});}var app=_react2.default.createElement('div',{id:'batfish-content'},this.props.content);if(this.props.rawAppHtml){app=_react2.default.createElement('div',{id:'batfish-content',dangerouslySetInnerHTML:{__html:this.props.rawAppHtml}});}return _react2.default.createElement('html',_extends({lang:'en'},this.props.htmlAttributes),head,_react2.default.createElement('body',this.props.bodyAttributes,app,appendToBody));}}]);return StaticHtmlPage;}(_react2.default.Component);exports.StaticHtmlPage=StaticHtmlPage;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//      
module.exports=Object.freeze({INLINE_CSS_MARKER:'<!-- INLINE CSS HERE, BATFISH -->',BATFISH_CSS_BASENAME:'batfish-styles.css',STATS_BASENAME:'stats.json',DATA_DIRECTORY:'data',EVENT_ERROR:'error',EVENT_NOTIFICATION:'notification',EVENT_DONE:'done',TARGET_NODE:'node',TARGET_BROWSER:'browser',PAGE_EXT_GLOB:'{js,md}'});

/***/ })
/******/ ]);
//# sourceMappingURL=static-render-pages.js.map