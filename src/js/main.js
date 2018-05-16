import React from 'react';
import createHistory from 'history/createHashHistory';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import { } from '../stylesheets/app.scss';

import NavBar from './navbar';
import ContractActionsPage from './contractactionspage';
import ContractSearchPage from './contractsearchpage';

const web3 = window.web3;

const history = createHistory({
    queryKey: false,
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            blockNumber: 0,
            offline_msg: '',
        };
    }

    componentDidMount() {
        const self = this;

        const knownNetworks = {
            1: 'Mainnet',
            3: 'Ropsten',
            4: 'Rinkeby',
            42: 'Kovan',
        };

        web3.version.getNetwork((err, id) => {
            if (err) console.error(err);
            else if (knownNetworks[id]) {
                self.setState({ networkId: { id, name: knownNetworks[id] } });
            } else {
                self.setState({ networkId: { id, name: 'Unknown' } });
            }
        });
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

App.propTypes = {
    children: PropTypes.array.isRequired,
};


window.onload = function () {
    ReactDOM.render((
        <Router history={history}>
            <App>
                <Route exact path="/" component={ContractSearchPage} />
                <Route path="/contract/:contract_address" component={ContractActionsPage} />
            </App>
        </Router>
    ), document.getElementById('main'));
};
