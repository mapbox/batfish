// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import ApplicationWrapper from 'batfish-internal/application-wrapper';
import { StaticHtmlPage } from './static-html-page';
import { Router } from './router';
import constants from '../node/constants';

export function renderHtmlPage(options: {
  route: BatfishRouteData,
  inlineJsScripts: string,
  css: string,
  appendToBody: Array<string>,
  spa: boolean
}): Promise<string> {
  return options.route.getPage().then(pageModule => {
    // We render the page content separately from the StaticHtmlPage, because
    // the page content is what will be re-rendered when the bundled JS loads
    // so it must match exactly what batfish-app.js renders (or you get React
    // checksum errors). The rest of StaticHtmlPage will never be re-rendered
    // by React.
    let pageContent;
    if (options.spa) {
      pageContent = React.createElement(pageModule.component, pageModule.props);
    } else {
      pageContent = (
        <ApplicationWrapper>
          <Router
            startingPath={options.route.path}
            startingComponent={pageModule.component}
            startingProps={pageModule.props}
          />
        </ApplicationWrapper>
      );
    }
    const rawAppHtml = ReactDOMServer.renderToString(pageContent);

    const helmetHead = Helmet.rewind();
    const reactDocument = (
      <StaticHtmlPage
        rawAppHtml={rawAppHtml}
        htmlAttributes={helmetHead.htmlAttributes.toComponent()}
        bodyAttributes={helmetHead.bodyAttributes.toComponent()}
        appendToHead={[
          helmetHead.title.toString(),
          helmetHead.base.toString(),
          helmetHead.meta.toString(),
          helmetHead.link.toString(),
          options.inlineJsScripts,
          helmetHead.script.toString(),
          constants.INLINE_CSS_MARKER,
          options.css,
          // This comes after the inlined and dynamically loaded CSS
          // so it will override regular stylesheets
          helmetHead.style.toString()
        ]}
        appendToBody={options.appendToBody}
      />
    );
    const html = ReactDOMServer.renderToStaticMarkup(reactDocument);
    return `<!doctype html>${html}`;
  });
}
