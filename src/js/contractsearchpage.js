import React from "react";

/*
Simple forwarding tool to simply forward to a token page when putting in an address so the user don't have to fiddle with the URL.
*/

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

    gotoContract() {
        console.log(this.state.value);
        this.props.history.push(`/contract/${this.state.value}`);
    }
};