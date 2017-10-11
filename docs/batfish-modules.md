# @mapbox/batfish/modules

Batfish exposes a few public modules to hook into its routing system and other internals.

## Table of contents

- [route-to](#route-to)
  - [route-to API](#route-to-api)
  - [route-to examples](#route-to-examples)
- [prefix-url](#prefix-url)
  - [prefix-url API](#prefix-url-api)
  - [prefix-url examples](#prefix-url-examples)
- [route-change-listeners](#route-change-listeners)
  - [route-change-listeners API](#route-change-listeners-api)
- [with-location](#with-location)
  - [with-location API](#with-location-api)
  - [with-location example](#with-location-example)

## route-to

Import from `'@mapbox/batfish/modules/route-to'`.

### route-to API

The following functions are named exports of `'@mapbox/batfish/modules/route-to'`.

#### routeTo

`routeTo(url: string): void`

If `url` is a Batfish route, go there with client-side routing.
If it's not, go there with a regular page load.

#### routeToPrefixed

`routeToPrefixed(url: string): void`

Like `routeTo` but automatically prefixes client-side routes with your [`siteOrigin`] configuration option.

### route-to examples

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - /about/jobs/writer/ is a page you made.
import { routeTo, routeToPrefixed } from '@mapbox/batfish/modules/route-to';

// Client-side routing is used.
routeTo('/about/jobs/writer/');

// Client-side routing sends you to /about/jobs/writer/.
routeToPrefixed('writer');

// Regular link behavior is used, since this is not a page that Batfish made.
routeTo('/somewhere/else');
```

## prefix-url

Use this module to prefix URLs on your site according to the [`siteBasePath`] and [`siteOrigin`] you specified in your configuration, ensuring that they point to the right place both during development and in production.

Import from `'@mapbox/batfish/modules/prefix-url'`.

### prefix-url API

The following functions are named exports of `'@mapbox/batfish/modules/prefix-url'`.

#### prefixUrl

`prefixUrl(url: string): string`

Returns the URL prefixed with your [`siteBasePath`].

If `url` is an absolute URL, it is returned unmodified.
If `url` is already prefixed with your [`siteBasePath`], it is returned unmodified.

#### prefixUrlAbsolute

`prefixUrlAbsolute(url: string): string`

Prefixes the URL with your [`siteOrigin`] and [`siteBasePath`], returning an absolute URL.

If `url` is already an absolute URL, it is returned unmodified.

**If you have not set [`siteOrigin`] in your configuration, this function with throw an error.**

### prefix-url examples

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - siteOrigin === 'https://mydomain.com'
import { prefixUrl, prefixUrlAbsolute } from '@mapbox/batfish/modules/prefix-url';

// The function prefixes a URL with siteBasePath.
prefixUrl('engineer') // -> '/about/jobs/engineer'

// You can also prefix an absolute path, if you've provided siteOrigin.
prefixUrlAbsolute('engineer') // -> 'https://mydomain.com/about/jobs/engineer'
```

## route-change-listeners

Batfish exposes a few functions that allow you to do things when client-side route changes occur.

Import from `'@mapbox/batfish/modules/route-change-listeners'`.

### route-change-listeners API

The following functions are named exports of `@mapbox/batfish/modules/route-change-listeners`.

#### addRouteChangeStartListener

```
addRouteChangeStartListener(pathname: string, listener: Function): Function;
addRouteChangeStartListener(listener: Function): Function;
```

Returns a function that will remove the listener — the equivalent of calling `removeRouteChangeStartListener` with the same arguments.

If `pathname` is provided (i.e. the first argument is a string), only route changes to this pathname will invoke the `listener`.
Otherwise, all route changes will invoke the `listener`.

The `listener` function receives the incoming pathname as an argument.

**The `listener` will be invoked immediately *before* the incoming page chunk starts downloading.**
If you return a `Promise` from your callback, **you can use this to delay rendering of the next page** (if, for example, you want to show a loading spinner for some period of time, or load some data before switching pages).
After the page chunk finishes downloading, the next page will not be rendered until your retured `Promise` has resolved.

#### removeRouteChangeStartListener

```
removeRouteChangeStartListener(pathname?: string, listener?: Function): Function;
removeRouteChangeStartListener(listener?: Function): Function;
```

If `pathname` is provided (i.e. the first argument is a string), `listener` will only be removed for route changes to this pathname .
Otherwise, `listener` will be removed for all route changes.

If no `listener` is provided, all listeners for the matched path (either `pathname` or all paths) will be removed.

#### addRouteChangeEndListener

```
addRouteChangeEndListener(pathname: string, listener: Function): Function;
addRouteChangeEndListener(listener: Function): Function;
```

The parameters and return value are equivalent to those for [`addRouteChangeStartListener`].

The difference is that **this function will be invoked immediately *after* the incoming page renders.**
The page chunk will have downloaded, your start-listener callbacks will have been invoked, the URL will have been changed, and the page will have rendered.
What you return from your `callback` will have no affect on page rendering.

`addRouteChangeEndListener` returns a function that will remove this particular listener.

#### removeRouteChangeEndListener

```
removeRouteChangeEndListener(pathname?: string, listener?: Function): Function;
removeRouteChangeEndListener(listener?: Function): Function;
```

The parameters and return value are equivalent to those for [`removeRouteChangeStartListener`].

## with-location

Import from `'@mapbox/batfish/modules/with-location'`.

This module exports a higher-order component that you can use to inject an abbreviated [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) object into the props of your own component.

### with-location API

The function functions are named exports from `'@mapbox/batfish/modules/with-location'`.

#### withLocation

```
withLocation(Component: React.Component): React.Component
```

Wraps `Component` in a stateless function component that passes it a `location` prop.

The value of `location` is an object with the following properties:

- `pathname`: This is *always* available (even at build time, during static rendering) because it is provided by Batfish's router.
- `hash`: This will not be available during static rendering, so check for its existence before using it.
- `search`: This will not be available during static rendering, so check for its existence before using it.

Returns the wrapper component.
The returned component exposes the original, wrapped component on the `WrappedComponent` static property.

### with-location example

```js
const withLocation = require('@mapbox/batfish/modules/with-location');

class MyPage extends React.Component {
  render() {
    return (
      <div>
        <div>pathname: {this.props.location.pathname}</div>
        <div>hash: {this.props.location.hash}</div>
        <div>search: {this.props.location.search}</div>
      </div>
    )
  }
}

module.exports = withLocation(MyPage);
```

[`sitebasepath`]: ./configuration.md#sitebasepath

[`siteorigin`]: ./configuration.md#siteorigin

[`addroutechangestartlistener`]: #addroutechangestartlistener

[`removeroutechangestartlistener`]: #removeroutechangestartlistener

[`removeroutechangeendlistener`]: #removeroutechangeendlistener
