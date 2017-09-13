# Hello world guide

**The bare minimum to get started with Batfish.**

☞ Run `npm install @mapbox/batfish --save`.

☞ Create a new `script` in your `package.json` to start Batfish: `"start": "batfish start"`.

☞ Create your first page file at `src/pages/index.js`.

☞ Export from that page file a React component that renders something. Maybe something like this:

```js
import React from 'react';

export default Home extends React.Component {
  render() {
    return (
      <div>Hello world</div>
    );
  }
}
```

☞ Run `npm run start`.

☞ Open the URL printed in your terminal.

☞ Build your website.
