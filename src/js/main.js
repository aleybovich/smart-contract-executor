import { } from "../stylesheets/app.scss";

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from 'react-router-dom';

import NavBar from "./navbar.js";
import ContractActionsPage from "./contractactionspage.js";
import ContractSearchPage from "./contractsearchpage.js";
const jQuery = require('jquery');

//remove _k thing from URLS (removing queryKey)
import createHistory from 'history/createHashHistory';

let history = createHistory({
    queryKey: false
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            blockNumber: 0,
            offline_msg: ''
        };
    }

    componentDidMount() {
        const self = this;

        const knownNetworks = {
            1: "Mainnet",
            3: "Ropsten",
            4: "Rinkeby",
            42: "Kovan"
        };

        web3.version.getNetwork((err, id) => {
            if (err) console.error(err);
            else {
                if (knownNetworks[id]) {
                    self.setState({ networkId: { id, name: knownNetworks[id] } });
                } else {
                    self.setState({ networkId: { id, name: "Unknown" } });
                }
            }
        })
    }

    render() {
        const networkId = this.state.networkId;
        console.log(networkId);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <NavBar networkId={networkId} />
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}


window.onload = function () {
    ReactDOM.render((
        <Router history={history}>
            <App>
                <Route exact path='/' component={ContractSearchPage} />
                <Route path='/contract/:contract_address' component={ContractActionsPage} />
            </App>
        </Router>
    ), document.getElementById('main'));
};
