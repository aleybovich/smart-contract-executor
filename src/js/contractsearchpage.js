import React from 'react';
import PropTypes from 'prop-types';

export default class ContractSearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);

        this.gotoContract = this.gotoContract.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    gotoContract() {
        console.log(this.state.value);
        this.props.history.push(`/contract/${this.state.value}`);
    }

    render() {
        return (
            <div>
                Enter the contract address: <br />
                <br />
                <input className="form-control" type="text" value={this.state.value} placeholder="0x1ceb00da..." onChange={this.handleChange} />
                <br />
                <button className="btn btn-default" onClick={this.gotoContract}>Go to Contract</button>
            </div>
        );
    }
}

ContractSearchPage.propTypes = {
    history: PropTypes.object.isRequired,
};
