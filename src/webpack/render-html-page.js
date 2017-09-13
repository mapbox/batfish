// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import ApplicationWrapper from 'batfish-internal/application-wrapper';
import { StaticHtmlPage } from './static-html-page';
import { Router } from './router';
import constants from '../node/constants';

export function renderHtmlPage(
  route: BatfishRouteData,
  inlineJsScripts: string,
  loadCssScript: string,
  appendToBody: Array<string>
): Promise<string> {
  return route.getPage().then(pageModule => {
    // We render the page content separately from the StaticHtmlPage, because
    // the page content is what will be re-rendered when the bundled JS loads
    // so it must match exactly what batfish-app.js renders (or you get React
    // checksum errors). The rest of StaticHtmlPage will never be re-rendered
    // by React.
    const pageContent = ReactDOMServer.renderToString(
      <ApplicationWrapper>
        <Router
          startingPath={route.path}
          startingComponent={pageModule.component}
          startingProps={pageModule.props}
        />
      </ApplicationWrapper>
    );

    const helmetHead = Helmet.rewind();
    const reactDocument = (
      <StaticHtmlPage
        rawAppHtml={pageContent}
        htmlAttributes={helmetHead.htmlAttributes.toComponent()}
        bodyAttributes={helmetHead.bodyAttributes.toComponent()}
        appendToHead={[
          helmetHead.title.toString(),
          helmetHead.base.toString(),
          helmetHead.meta.toString(),
          helmetHead.link.toString(),
          inlineJsScripts,
          helmetHead.script.toString(),
          constants.INLINE_CSS_MARKER,
          loadCssScript,
          // This comes after the inlined and dynamically loaded CSS
          // so it will override regular stylesheets
          helmetHead.style.toString()
        ]}
        appendToBody={appendToBody}
      />
    );
    const html = ReactDOMServer.renderToStaticMarkup(reactDocument);
    return `<!doctype html>${html}`;
  });
}
