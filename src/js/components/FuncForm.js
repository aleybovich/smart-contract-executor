/* eslint react/jsx-indent-props: off */
import React from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import InputForm from './inputform';
//import CheckBox from './checkbox';

const web3 = window.web3;

const Web3Utils = require('web3-utils');
const truffleContract = require('truffle-contract');

export default class FuncForm extends React.Component {
    constructor(props) {
        super(props);

        this.executeFunction = this.executeFunction.bind(this);
        this.handlePayChange = this.handlePayChange.bind(this);

        this.state = { payVal: '' };
    }

    async getAccount() {
        return new Promise((resolve, reject) => {
            web3.eth.getAccounts((err, accounts) => {
                if (err) reject(err);
                else if (!accounts.length) reject('No Metamask accounts found');
                else {
                    resolve(accounts[0]);
                }
            });
        });
    }

    resultToString(result) {
        if (result.toPrecision instanceof Function) return result.toFormat(0);
        return result.toString();
    }

    isInputValid(val, type) {
        if (type === 'address') {
            return Web3Utils.isAddress(val);
        } else if (type.startsWith('uint')) {
            try {
                // try to convert input into big number
                BigNumber(val);
                return true;
            } catch (e) {
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
        });

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
                abi: abi.concat(this.props.eventsAbi),
            });

            contract.setProvider(web3.currentProvider);
            contract.defaults({ from: fromAddress });

            if (this.isTransaction()) {
                console.log('Invoking ETH transaction');

                // Get
                let valueArg = null;
                if (this.isPayable() && !isNaN(parseFloat(self.state.payVal))) {
                    valueArg = { value: parseFloat(self.state.payVal) * (10 ** 18) };
                    args.push(valueArg);
                }

                contract.at(this.props.contractAddress)
                    .then(instance => instance[funcName](...args)
                    )
                    .then(tx => {
                        if (tx.logs.length) {
                            if (this.props.onLogs instanceof Function) {
                                this.props.onLogs(tx.logs);
                            }
                        }

                        self.setState({ error: null, processing: false, result: 'Success' });
                    })
                    .catch(error => {
                        console.error(error);
                        self.setState({ error, processing: false, result: null });
                    });
            } else {
                console.log('Making a simlple call');

                contract.at(this.props.contractAddress)
                    .then(instance => instance[funcName].call(...args))
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

    isTransaction() {
        const funcAbi = this.props.funcAbi;
        return funcAbi.stateMutability !== 'view' && !funcAbi.constant;
    }

    isPayable() {
        const funcAbi = this.props.funcAbi;
        return funcAbi.payable;
    }

    handlePayChange(evt) {
        const reg = /[-+]?[0-9]*\.?[0-9]*/;
        const val = evt.target.value;

        if (!val) {
            this.setState({ payVal: '' });
        } else {
            const matches = val.match(reg);

            if (matches && matches.length && matches[0] === val) {
                this.setState({ payVal: val });
            } else {
                this.setState({ payVal: this.state.payVal || '' });
            }
        }
    }

    render() {
        // abi is a JSON object
        const funcAbi = this.props.funcAbi;
        if (!funcAbi.inputs) funcAbi.inputs = [];

        let buttonMessage;
        if (this.state.processing) {
            buttonMessage = <span><i className="fa fa-circle-o-notch fa-spin" /> Awaiting Confirmation </span>;
        } else {
            buttonMessage = this.isTransaction() ? 'Execute Transaction' : 'Query';
        }

        const error = this.state.error ?
            (<div className="alert alert-danger result">
                {this.state.error.toString()}
            </div>) : null;

        const result = ('result' in this.state) && this.state.result != null ?
            (<div className="alert alert-success result">
                <strong>Result:</strong> {this.state.result.toString()}
            </div>) : null;

        const self = this;
        const getValidationError = (ref) =>
            (self.state.inputErrors ? self.state.inputErrors[ref] : null);

        const paymentLine = this.isTransaction() && this.isPayable()
            ? (<div style={{ float: 'left' }}> Send
                <input type="text" value={this.state.payVal} onChange={this.handlePayChange} /> Eth </div>)
            : null;

        return (
            <div className="panel panel-default">
                <div className="panel-heading"><h4>{funcAbi.name}</h4></div>
                <div className="panel-body">
                    {
                        funcAbi.inputs.map(i =>
                            (
                                <InputForm
                                    key={`${funcAbi.name}-${i.name}`}
                                    ref={`${funcAbi.name}-${i.name}`}
                                    placeholder={i.name}
                                    validationError={getValidationError(`${funcAbi.name}-${i.name}`)}
                                    onChange={() => self.setState({ inputErrors: null })}
                                />
                            )
                        )
                    }
                    {paymentLine}
                    <button type="submit" className="btn btn-default execute" style={{ float: 'right' }} onClick={this.executeFunction}>{buttonMessage}</button>
                </div>
                <div className="panel-footer">
                    {error}
                    {result}
                </div>
            </div>
        );
    }
}

FuncForm.propTypes = {
    funcAbi: PropTypes.object.isRequired,
    eventsAbi: PropTypes.array.isRequired,
    contractAddress: PropTypes.string.isRequired,
    onLogs: PropTypes.func.isRequired,
};
