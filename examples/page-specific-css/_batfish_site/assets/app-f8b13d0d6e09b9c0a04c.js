webpackJsonp(["app"],{"/0jl":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.BatfishApp=void 0;var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=u(n("ccIB")),a=n("f66t"),i=u(n("Zzfv"));function u(e){return e&&e.__esModule?e:{default:e}}t.BatfishApp=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default.Component),o(t,[{key:"shouldComponentUpdate",value:function(){return!1}},{key:"render",value:function(){return r.default.createElement(i.default,null,r.default.createElement(a.Router,{startingPath:this.props.startingPath,startingComponent:this.props.pageModule.component,startingProps:this.props.pageModule.props}))}}]),t}()},0:function(e,t,n){e.exports=n("00b+")},"00b+":function(e,t,n){"use strict";var o,r=n("ccIB"),a=(o=r)&&o.__esModule?o:{default:o},i=n("KLxj"),u=n("8jKv"),c=n("/0jl");var s=window.location.pathname;(0,i.findMatchingRoute)(s).getPage().then(function(e){(0,u.renderAppIntoDom)(a.default.createElement(c.BatfishApp,{startingPath:s,pageModule:e}))})},"3OFu":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.batfishContext={selectedConfig:{siteBasePath:"",siteOrigin:"",hijackLinks:!0,manageScrollRestoration:!0},routes:[{path:"/",getPage:function(){return n.e("home").then(n.bind(null,"TcQS"))}},{path:"/another/",getPage:function(){return n.e("another").then(n.bind(null,"2GdF"))}}],notFoundRoute:{path:"",getPage:function(){throw new Error("No matching route.")},is404:!0}}},"8QOl":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.invokeCallbacks=f,t.addRouteChangeStartListener=function(e,t){return s(e,t,i,h)},t.removeRouteChangeStartListener=h,t.addRouteChangeEndListener=function(e,t){return s(e,t,u,p)},t.removeRouteChangeEndListener=p,t._invokeRouteChangeStartCallbacks=function(e){return f(e,i)},t._invokeRouteChangeEndCallbacks=function(e){return f(e,u)};var o=n("BZ+Q");function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a="*",i=r({},a,[]),u=r({},a,[]);function c(e){return e===a||(0,o.isUrlPrefixed)(e)||(e=(0,o.prefixUrl)(e)),e.replace(/\/$/,"")}function s(e,t,n,o){var r=void 0,i=void 0;return"function"===typeof e?(r=e,i=a):(r=t,i=e),n[i=c(i)]||(n[i]=[]),n[i].push(r||d),function(){return o(i,r)}}function l(e,t,n){var o=void 0,r=void 0;if("function"!==typeof e&&e?(o=t,r=e):(o=e,r=a),r=c(r),o){for(var i=n[r],u=0,s=i.length;u<s;u++)if(i[u]===o)return void i.splice(u,1)}else n[r]=[]}function f(e,t){e=c(e);var n=[Promise.resolve()];return t[e]&&t[e].forEach(function(t){n.push(Promise.resolve(t(e)))}),t[a].forEach(function(t){n.push(Promise.resolve(t(e)))}),Promise.all(n)}function h(e,t){l(e,t,i)}function p(e,t){l(e,t,u)}function d(){}},"8jKv":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.renderAppIntoDom=function(e){var t=document.getElementById("batfish-content");if(!t)return;(a.default.hydrate?a.default.hydrate:a.default.render)(e,t)};var o,r=n("x9tB"),a=(o=r)&&o.__esModule?o:{default:o}},"BZ+Q":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o="",r=void 0;function a(e){return/^https?:/.test(e)}function i(e){return a(e)?e:o&&0===e.indexOf(o)?e:(/^\//.test(e)||(e="/"+e),o+e)}i._configure=function(e,t){o=e||"",r=t},t.prefixUrl=i,t.prefixUrlAbsolute=function(e){return a(e)?e:r?(/^\//.test(e)||(e="/"+e),r+o+e):e},t.isUrlPrefixed=function(e){return 0===e.indexOf(o)}},DQAf:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.scrollToFragment=function(){var e=window.location.hash;if(!e)return;var t=document.getElementById(e.replace("#",""));t&&t.scrollIntoView()}},Jzjy:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCurrentLocation=function(){var e=(0,o.getWindow)(),t=e.location.pathname;/\/$/.test(t)||(t+="/");return{pathname:t,hash:e.location.hash,search:e.location.search}};var o=n("yiTV")},KJBQ:function(e,t){e.exports=function(e,t){var n,o=document.querySelectorAll(e),r=o.length;for(n=0;n<r;n++)if(o[n]===t||o[n].contains(t))return!0;return!1}},KLxj:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.findMatchingRoute=function(e,t){var n=void 0===(t=t||{}).useCache||t.useCache;if(n&&a[e])return a[e];var i=void 0;n&&r?i=r:(u=o.batfishContext.routes,i=u.reduce(function(e,t){var n=t.internalRouting?"(/.+)?$":"$";return e[t.path]=new RegExp("^"+t.path.replace(/\//g,"[/]")+"?"+n),e},{}),r=i);var u;for(var c=void 0,s=0;s<o.batfishContext.routes.length;s++){var l=o.batfishContext.routes[s];if(i[l.path].test(e)){c=l;break}}c||(c=o.batfishContext.notFoundRoute);return a[e]=c,c};var o=n("3OFu");var r=void 0,a={}},Zzfv:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e.children}},f66t:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Router=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=m(n("ccIB")),i=m(n("3/B0")),u=m(n("coA4")),c=m(n("7jTh")),s=m(n("xEES")),l=m(n("KJBQ")),f=n("3OFu"),h=n("ua0J"),p=n("BZ+Q"),d=n("KLxj"),v=n("DQAf"),g=n("yiTV"),b=n("gcs9"),y=n("Jzjy");function m(e){return e&&e.__esModule?e:{default:e}}var _=f.batfishContext.selectedConfig,P=_.siteBasePath,j=_.siteOrigin,w=_.manageScrollRestoration,O=_.hijackLinks;p.prefixUrl._configure(P,j);var C=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.routeTo=function(e){var t=(0,g.getWindow)(),o=(0,s.default)(e);if((0,d.findMatchingRoute)(o.pathname).is404)return t.location.assign(e);(0,b.changePage)(o,n.setState.bind(n),{pushState:!0,scrollToTop:t.location.pathname!==o.pathname||!o.hash})};var o={pathname:n.props.startingPath};if("undefined"!==typeof window){var r=(0,g.getWindow)();o.search=r.location.search,o.hash=r.location.hash}return n.state={path:n.props.startingPath,PageComponent:n.props.startingComponent,pageProps:n.props.startingProps,location:o},n}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.PureComponent),r(t,[{key:"getChildContext",value:function(){return{location:this.state.location}}},{key:"componentDidMount",value:function(){var e=this;w&&c.default.start({autoRestore:!1});var t=(0,g.getWindow)();!t.location.hash&&w?c.default.restoreScroll():(0,v.scrollToFragment)(),h.routeTo._setRouteToHandler(this.routeTo),t.addEventListener("popstate",function(n){n.preventDefault(),(0,b.changePage)({pathname:t.location.pathname,search:t.location.search,hash:t.location.hash},e.setState.bind(e))}),O&&u.default.hijack({skipFilter:function(e){return(0,l.default)("[data-batfish-no-hijack]",e)}},this.routeTo),this.setState({location:(0,y.getCurrentLocation)()})}},{key:"render",value:function(){var e=this.state.PageComponent;return e?a.default.createElement(e,o({location:this.state.location},this.state.pageProps)):null}}]),t}();C.childContextTypes={location:i.default.shape({pathname:i.default.string.isRequired,hash:i.default.string,search:i.default.string}).isRequired},t.Router=C},gcs9:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changePage=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=arguments[3],r=(0,l.getWindow)(),f=(0,i.findMatchingRoute)(e.pathname),h=[e.pathname,e.hash,e.search].join(""),p=(0,c._invokeRouteChangeStartCallbacks)(e.pathname);return f.getPage().then(function(e){return p.then(function(){return e})}).then(function(i){n.pushState&&r.history.pushState({},null,h);var l={path:f.path,PageComponent:i.component,pageProps:i.props,location:(0,s.getCurrentLocation)()};t(l,function(){e.hash?(0,u.scrollToFragment)():n.scrollToTop?r.scrollTo(0,0):a.default.getSavedScroll()&&a.default.restoreScroll(),o&&o(),(0,c._invokeRouteChangeEndCallbacks)(e.pathname)})})};var o,r=n("7jTh"),a=(o=r)&&o.__esModule?o:{default:o},i=n("KLxj"),u=n("DQAf"),c=n("8QOl"),s=n("Jzjy"),l=n("yiTV")},ua0J:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.routeToPrefixed=t.routeTo=void 0;var o=n("BZ+Q"),r=void 0,a=void 0;function i(e){r||(a?a(e):r=e)}i._setRouteToHandler=function(e){a=e,r&&(a(r),r=null)},i._clearRouteToHandler=function(){a=null},t.routeTo=i,t.routeToPrefixed=function(e){i((0,o.prefixUrl)(e))}},xEES:function(e,t,n){"use strict";e.exports=function(e){var t=e;return"string"===typeof e&&(e=e.replace(/^\S+?@/,""),(t=document.createElement("a")).href=e,""===location.host&&(location.href=location.href)),{pathname:t.pathname,hash:t.hash,search:t.search}}},yiTV:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getWindow=function(){if("undefined"===typeof window)throw new Error("Do not call getWindow in code that will run during the static build.");return window}}},[0]);