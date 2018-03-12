// @flow
import ReactDOM from 'react-dom';

export function renderAppIntoDom(AppElement: *) {
  const container = document.getElementById('batfish-content');
  if (!container) return;
  // React 16 has ReactDOM.hydrate for hydrating server-rendered markdup.
  const render =
    process.env.DEV_SERVER || !ReactDOM.hydrate
      ? ReactDOM.render
      : ReactDOM.hydrate;
  render(AppElement, container);
}
