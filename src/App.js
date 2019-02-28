import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { HomeView, InvestigatorListView, FileUploadView, FileListView } from './views';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div className="Header-wrapper">
            {/* placeholder for header */}
          </div> 

          <main className="App">
            <Switch>
              <Route exact path="/" component={HomeView}></Route>
              <Route path="/investigator-list" component={InvestigatorListView}></Route>
              <Route path="/file-upload" component={FileUploadView}></Route>
              <Route path="/file-list" component={FileListView}></Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
