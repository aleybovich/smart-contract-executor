import React from "react";
import InputForm from "./inputform";
import CheckBox from "./checkbox";
import BigNumber from 'bignumber.js';

const Web3Utils = require('web3-utils');
const truffleContract = require("truffle-contract"); 

export default class FuncForm extends React.Component {
    constructor(props) {
        super(props);

        this.executeFunction = this.executeFunction.bind(this);

        this.state = {};
    }

    resultToString(result) {
        if (result.toPrecision instanceof Function) return result.toFormat(0);
        return result.toString();
    }

    async getAccount() {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) reject(err);
                else if (!accounts.length) reject("No Metamask accounts found");
                else {
                    resolve(accounts[0]);
                }
            });
        });
    }

    isInputValid(val, type) {
        if (type == "address") {
            return Web3Utils.isAddress(val);
        } else if (type.startsWith("uint")) {
            try {
                // try to convert input into big number
                BigNumber(val);
                return true;
            }
            catch (e) {
                return false;
            }
        } else {
            return true;
        }
    }

    validateInputs() {
        // Get a map of refIds to refs
        const self = this;

        // map of (refId: errorMessage)
        const errors = {};

        this.props.funcAbi.inputs.forEach(i => {
            const refId = `${self.props.funcAbi.name}-${i.name}`;
            const val = self.refs[refId].state.val;
            const placeholder = self.refs[refId].props.placeholder;

            if (!val) errors[refId] = `${placeholder} is empty`;
            else if (!self.isInputValid(val, i.type)) errors[refId] = `${val} is not of type ${i.type}`;
        })

        if (Object.keys(errors).length !== 0) {
            this.setState({ inputErrors: errors });
            return false;
        }

        this.setState({ inputErrors: null });
        return true;
    }

    async executeFunction() {
        try {

            if (!this.validateInputs()) return;

            const self = this;
            const args = this.props.funcAbi.inputs.map(i => {
                const ref = `${self.props.funcAbi.name}-${i.name}`;
                return self.refs[ref].state.val;
            });

            this.setState({ error: null, result: null, processing: true });

            const fromAddress = await this.getAccount();
            console.log(`From: ${fromAddress}`);

            let abi = this.props.funcAbi;
            if (!Array.isArray(abi)) abi = [abi];

            const funcName = this.props.funcAbi.name;

            const contract = truffleContract({
                abi: abi.concat(this.props.eventsAbi)
              });

            contract.setProvider(web3.currentProvider);
            contract.defaults({ from: fromAddress});

            if (this.isTransaction()) {
                console.log("Invoking ETH transaction");

                contract.at(this.props.contractAddress)
                    .then(instance => {
                        return instance[funcName](...args);
                    })
                    .then(tx => {
                        if (tx.logs.length) {
                            if (this.props.onLogs instanceof Function) {
                                this.props.onLogs(tx.logs);
                            }
                        }
                        
                        self.setState({ error: null, processing: false, result: "Success" });
                    })
                    .catch(error => {
                        console.error(error);
                        self.setState({ error, processing: false, result: null });
                    });
            } else {
                console.log("Making a simlple call");

                contract.at(this.props.contractAddress)
                    .then(instance => {
                        return instance[funcName].call(...args);
                    })
                    .then(result => {
                        const stringResult = this.resultToString(result);
                        console.log(`Result: ${stringResult}`);
                        self.setState({ error: null, processing: false, result: stringResult });
                    })
                    .catch(error => {
                        console.error(error);
                        self.setState({ error, processing: false, result: null });
                    });
            }
        } catch (error) {
            console.error(error);
            this.setState({ error, processing: false, result: null });
        }
    }

    isTransaction () {
        const funcAbi = this.props.funcAbi;
        return funcAbi.stateMutability != "view" && !funcAbi.constant;
    }

    render() {
        // abi is a JSON object
        const funcAbi = this.props.funcAbi;
        if (!funcAbi.inputs) funcAbi.inputs = [];

        if (this.state.processing) {
            var buttonMessage = <span><i className="fa fa-circle-o-notch fa-spin"></i> Awaiting Confirmation </span>;
        } else {
            var buttonMessage = "Execute";
        }

        const error = this.state.error ?
            <div className="alert alert-danger result">
                <strong>Error!</strong> {this.state.error.toString()}
            </div> : null;

        const result = ("result" in this.state) && this.state.result != null ?
            <div className="alert alert-success result">
                <strong>Result:</strong> {this.state.result.toString()}
            </div> : null;

        const txnLabel = this.isTransaction() ? <div><i>Transaction</i></div> : null;

        const self = this;
        const getValidationError = (ref) => {
            return self.state.inputErrors ? self.state.inputErrors[ref] : null;
        }

        return (
            <div className="panel panel-default">
                <div className="panel-heading"><h4>{funcAbi.name}</h4></div>
                <div className="panel-body">
                    {
                        funcAbi.inputs.map(i =>
                            <InputForm
                                key={`${funcAbi.name}-${i.name}`}
                                ref={`${funcAbi.name}-${i.name}`}
                                placeholder={i.name}
                                validationError={getValidationError(`${funcAbi.name}-${i.name}`)}
                                onChange={() => self.setState({ inputErrors: null })} />
                        )
                    }
                    {txnLabel}
                    <button type="submit" className="btn btn-default execute" onClick={this.executeFunction}>{buttonMessage}</button>
                    {error}
                    {result}
                </div>
            </div>
        );
    }
}