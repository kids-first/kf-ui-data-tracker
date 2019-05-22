import './index.css';
import React from 'react';
import App from './App';
import {render} from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

const RootHtml = () => <App />;

render(<RootHtml />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./App', () => {
    render(<RootHtml />, document.getElementById('root'));
  });
}
