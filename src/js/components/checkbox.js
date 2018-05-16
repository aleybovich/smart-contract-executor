import React from 'react';
import PropTypes from 'prop-types';
/*
A generic component for an input field.
*/

export default class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { val: this.props.checked };

        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    handleCheckChange(event) {
        this.setState({ val: event.target.checked });
        console.log(event.target.checked);
    }

    render() {
        return (
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id={this.props.name} checked={this.state.val} onChange={this.handleCheckChange} />
                <label className="form-check-label" htmlFor={this.props.name}>
                    {this.props.label}
                </label>
            </div>
        );
    }
}


CheckBox.propTypes = {
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
