import React from "react";
import FuncFormList from "./components/FuncFormList";
import HumanStandardTokenAbi from "human-standard-token-abi";

export default class ContractActionsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { contract_address: this.props.params.contract_address };

        this.buildFunctions = this.buildFunctions.bind(this);

        this.abiTextareaChange = this.abiTextareaChange.bind(this);

        this.populateTokenAbi = this.populateTokenAbi.bind(this);
    }

    buildFunctions() {
        let abi;

        try {
            abi = JSON.parse(this.state.abiText);

            this.setState({ "abi-parse-error": null, abi });
        }
        catch (error) {
            this.setState({ "abi-parse-error": error.toString(), abi: null });
        }
    }

    abiTextareaChange(event) {
        this.setState({ abiText: event.target.value });
    }

    populateTokenAbi() {
        this.setState({ abiText: JSON.stringify(HumanStandardTokenAbi) });
    }

    render() {

        const abiParseError = this.state["abi-parse-error"] ?
            <div className="alert danger">{this.state["abi-parse-error"]}</div> : null;

        const functions = this.state.abi ? <FuncFormList abi={this.state.abi} contractAddress={this.state.contract_address} /> : null;

        return (
            <div>
                <h4> Contract: {this.state.contract_address} </h4>
                <div className="form">
                    <div className="form-group">
                        <textarea className="form-control" rows="5" placeholder="ABI" onChange={this.abiTextareaChange} value={this.state.abiText}></textarea>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-default" onClick={this.buildFunctions}>Build functions</button> &nbsp;
                    <a href="javascript:void(0)" onClick={this.populateTokenAbi}>Populate ERC20 TokenABI</a>
                    </div>
                    {abiParseError}
                </div>
                {functions}
            </div>);
    }
}