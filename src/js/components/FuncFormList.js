import React from "react";
import FuncForm from './FuncForm'

export default class FuncFormList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let abi = this.props.abi;

        if (!Array.isArray(abi)) {
            abi = [abi];
        }

        abi = abi.filter(f => f.type === "function");

        abi.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());

        return (
            <div>
                {abi.map((f, i) => <FuncForm funcAbi={f} key={`${i}-${Date.now()}`} contractAddress={this.props.contractAddress} />)}
            </div>
        );
    }
}