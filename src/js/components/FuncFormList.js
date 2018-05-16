/* eslint react/jsx-indent-props: off */
import React from 'react';
import PropTypes from 'prop-types';
import FuncForm from './FuncForm';

export default class FuncFormList extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    onLogs(logs) {
        // If we have onLogs handler specified by the parent component,
        // pass the logs to it
        if (this.props.onLogs instanceof Function) {
            this.props.onLogs(logs);
        }
    }

    render() {
        let abi = this.props.abi;

        if (!Array.isArray(abi)) {
            abi = [abi];
        }

        const funcs = abi.filter(f => f.type === 'function');

        const events = abi.filter(f => f.type === 'event');

        funcs.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());

        return (
            <div>
                {
                    funcs.map((f, i) =>
                        (
                            <FuncForm
                                funcAbi={f}
                                eventsAbi={events}
                                key={`${i}-${Date.now()}`}
                                contractAddress={this.props.contractAddress}
                                onLogs={this.onLogs.bind(this)}
                            />
                        )
                    )
                }
            </div>
        );
    }
}

FuncFormList.propTypes = {
    abi: PropTypes.array.isRequired,
    contractAddress: PropTypes.string.isRequired,
    onLogs: PropTypes.func.isRequired,
};
