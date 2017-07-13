'use strict';

const csso = require('csso');

/**
 * Transform CSS into a simple JS module that writes the CSS to a <style>
 * tag in the <head> of the document.
 *
 * @param {string} css
 * @return {string} - The JS module.
 */
function pageSpecificStyleLoader(css) {
  const minifiedCss = csso.minify(css).css;
  const js = `
    const React = require('react');
    const css = \`${minifiedCss}\` ;
    class HeadCss extends React.Component {
      shouldComponentUpdate() {
        return false;
      }
      componentDidMount() {
        this.styleTag = document.createElement('style');
        this.styleTag.setAttribute('type', 'text/css');
        if ('textContent' in this.styleTag) {
          this.styleTag.textContent = css;
        } else {
          this.styleTag.styleSheet.cssText = css;
        }
        document.head.appendChild(this.styleTag);
      }
      componentWillUnmount() {
        document.head.removeChild(this.styleTag);
      }
      render() {
        return null;
      }
    }
    module.exports = HeadCss;
  `.trim();
  return js;
}

module.exports = pageSpecificStyleLoader;
