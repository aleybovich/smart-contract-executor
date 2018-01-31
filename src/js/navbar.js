import React from "react";
import { Link } from "react-router";

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_blocknr: 0,
      current_timestamp: 0,
      time_diff: 0
    };
  }

  componentDidMount() {
    var that = this;
    window.setInterval(function(){
      var ts = that.state.current_timestamp;
      var now = Math.floor(Date.now()/1000);
      web3.eth.getBlock("latest", function(err, result) {
        if(result.number > that.state.current_blocknr) {
          that.setState({current_blocknr: result.number});
          that.setState({current_timestamp: now});
          ts = now;
        }
      });

      if(ts > 0) {
        that.setState({time_diff: now - ts});
      }
    }, 1000);
  }

  componentDidUpdate() {
    //problem of relying on reflux-tx is that reflux-tx only updates blocks when it is actively having a tx in it.
    //so have to resort to manual checking.
  }
  render() {

    const networkWarning = this.props.networkId && this.props.networkId.id == 1 ? 
      <div className="alert alert-warning"><h5>Warning: you are connected to Mainnet</h5></div> : null;

    return (
      <div>
        <nav style={{}} className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <p className="navbar-text" style={{textDecoration: 'underline'}}>Block Number: {this.state.current_blocknr}. {this.state.time_diff}s. </p>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><Link to={'/'}>Home</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        {networkWarning}
      </div>
    );
  }
}

  