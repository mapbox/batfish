webpackJsonp(["home"],{"04qB":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n("ccIB")),a=u(n("tHZf"));function u(e){return e&&e.__esModule?e:{default:e}}var i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.PureComponent),r(t,[{key:"render",value:function(){var e=this.props;return o.default.createElement(a.default,{frontMatter:e.frontMatter},o.default.createElement("h1",{className:"customHeading"},e.frontMatter.title),o.default.createElement("p",{className:"my12"},"This is a basic Batfish JavaScript page."),o.default.createElement("p",null,o.default.createElement("a",{href:"/markdown/",className:"link txt-underline"},"Go to the Markdown page.")))}}]),t}();t.default=i},TcQS:function(e,t,n){"use strict";var r=n("04qB");r=r.default||r,e.exports={component:r,props:{frontMatter:{title:"JavaScript page",description:"A basic Batfish example."}}}},tHZf:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=u(n("ccIB")),a=(u(n("3/B0")),u(n("yiDs")));function u(e){return e&&e.__esModule?e:{default:e}}var i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"render",value:function(){var e=this.props,t=e.frontMatter.title+" | Basic";return o.default.createElement("div",null,o.default.createElement(a.default,null,o.default.createElement("html",{lang:"en"}),o.default.createElement("meta",{charSet:"utf-8"}),o.default.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),o.default.createElement("title",null,t),o.default.createElement("meta",{name:"description",content:e.frontMatter.description})),o.default.createElement("div",{className:"px30 py30"},e.children))}}]),t}();t.default=i}});