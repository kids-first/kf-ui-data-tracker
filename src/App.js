import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { HomeView, InvestigatorListView, FileUploadView, FileListView } from './views';


const Home = () => <HomeView />;
const InvestigatorList = () => <InvestigatorListView />;
const FileUpload = () => <FileUploadView />;
const FileList = () => <FileListView />;

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
              <Route exact path="/" component="{Home}"></Route>
              <Route path="/investigator-list" component="{InvestigatorList}"></Route>
              <Route path="/file-upload" component="{FileUpload}"></Route>
              <Route path="/file-list" component="{FileList}"></Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
