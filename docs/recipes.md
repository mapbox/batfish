# Recipes

How to do some things that you might want to do and might not know how to do.

## Inject JS onto the page with an inline `<script>` tag

You can just use [react-helmet]!

Keep in mind that the code will need to be a string.

```jsx
class MyPage extends React.Component {
  return (
    <div>
      <Helmet>
        <script>{'console.log("this will log")'}</script>
      </Helmet>
    </div>
  )
}
```

If you follow this pattern, your `<script>` tag will appear in the document's `<head>` both in the development server and in the static HTML.

Maybe you have your code in its own file and want to keep it there and load it from there, instead of pasting it as a string in a React component.
This can be done by using Webpack's [raw-loader] to import the source file as a string.

```jsx
const mySpecialScript = require('raw-loader!../js/my-special-script.js');
class MyPage extends React.Component {
  return (
    <div>
      <Helmet>
        <script>{mySpecialScript}</script>
      </Helmet>
    </div>
  )
}
```

You can also use the [`webpackLoaders`] option in your Batfish configuration to avoid the Webpack-specific `require('raw-loader!'..)` syntax.

[react-helmet]: https://github.com/nfl/react-helmet
[raw-loader]: https://github.com/webpack-contrib/raw-loader
[`webpackLoaders`]: configuration.md#webpackloaders
