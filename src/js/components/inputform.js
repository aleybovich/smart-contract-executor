import React from "react";

/*
A generic component for an input field.
*/

var InputForm = React.createClass({
  getInitialState: function () {
    return {
      val: '',
    };
  },
  handleChange: function (event) {
    this.setState({ val: event.target.value });

    // Handle possible parent handler
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },
  render: function () {
    const validationError = this.props.validationError;

    const className = `form-control ${validationError ? " has-error" : ""}`;

    const errorMessage = validationError ? <span className="help-block" style={{ color: "maroon" }}>{validationError}</span> : null;

    return (
      <div style={{ marginBottom: "20px" }}>
        <input type="text" className={className} value={this.state.val} placeholder={this.props.placeholder} onChange={this.handleChange} />
        {errorMessage}
      </div>
    );
  }
});
module.exports = InputForm;
