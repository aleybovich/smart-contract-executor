import React from 'react';
import PropTypes from 'prop-types';

/*
A generic component for an input field.
*/

export default class InputForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { val: '' };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        this.setState({ val: evt.target.value });

        // Handle possible parent handler
        if (this.props.onChange) {
            this.props.onChange(evt);
        }
    }

    render() {
        const validationError = this.props.validationError;

        const className = `form-control ${validationError ? ' has-error' : ''}`;

        const errorMessage = validationError ? <span className="help-block" style={{ color: 'maroon' }}>{validationError}</span> : null;

        return (
            <div style={{ marginBottom: '20px' }}>
                <input type="text" className={className} value={this.state.val} placeholder={this.props.placeholder} onChange={this.handleChange} />
                {errorMessage}
            </div>
        );
    }
}

InputForm.propTypes = {
    placeholder: PropTypes.string.isRequired,
    validationError: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

InputForm.defaultProps = {
    validationError: null,
};
