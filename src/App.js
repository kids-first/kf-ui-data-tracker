import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from 'kf-uikit';
import 'kf-uikit/dist/styles.css';
import './App.css';
import { HomeView, InvestigatorListView, FileUploadView, FileListView } from './views';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <div className="Header-wrapper container block border-b-2 border-solid border-grey">
            <Header />
          </div> 

          <main className="App">
            <Switch>
              <Route 
                exact path="/" 
                render={ () => {
                  return (
                    <div className="grid-container">
                      <HomeView 
                        className="column-grid sm\:column-grid md\:column-grid lg\:column-grid xl\:column-grid" 
                      />
                    </div>
                  );
                }}
              />
              <Route 
                path="/investigator-list" 
                render={ () => {
                  return (
                    <div className="grid-container">
                      <InvestigatorListView
                        className="column-grid sm\:column-grid md\:column-grid lg\:column-grid xl\:column-grid" 
                      />
                    </div>
                  );
                }}
              />
              <Route 
                path="/file-upload"
                render={ () => {
                  return (
                    <div className="grid-container">
                      <FileUploadView
                        className="column-grid sm\:column-grid md\:column-grid lg\:column-grid xl\:column-grid" 
                      />
                    </div>
                  );
                }}
              />
              <Route 
                path="/file-list" 
                render={ () => {
                  return (
                    <div className="grid-container">
                      <FileListView
                        className="column-grid sm\:column-grid md\:column-grid lg\:column-grid xl\:column-grid" 
                      />
                    </div>
                  );
                }}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
