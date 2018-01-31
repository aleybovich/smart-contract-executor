import {} from "../stylesheets/app.scss";

import React from "react";
import ReactDOM from "react-dom";
import ReactRouter from "react-router";
import { Router, Route, IndexRoute, Link } from 'react-router';

import NavBar from "./navbar.js";
import ContractActionsPage from "./contractactionspage.js";
import ContractSearchPage from "./contractsearchpage.js";
require('bootstrap-webpack!./bootstrap.config.js');
var jQuery = require('jquery');


//remove _k thing from URLS (removing queryKey)
import createHistory from 'history/lib/createHashHistory';

let history = createHistory({
  queryKey: false
});

let App = React.createClass({
  getInitialState: function() {
    return {
      blockNumber: 0,
      offline_msg: ''
    };
  },
  componentDidMount: function() {
    var that = this;
    if(window.offline == true) {
      console.log('offline');
      this.setState({offline_msg: "YOU ARE OFFLINE."});
      this.setState({blockNumber: 'OFFLINE'});
    }

  },
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
              <NavBar offline_msg={this.state.offline_msg}/>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

window.onload = function() {

  ReactDOM.render((
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={ContractSearchPage} />
        <Route path="/contract/:contract_address" component={ContractActionsPage} />
      </Route>
    </Router>
  ), document.getElementById('main'));
};
