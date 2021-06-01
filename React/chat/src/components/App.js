import React, { Component } from 'react';
import {connect} from 'react-redux';;

class App extends Component {
  render() {
    return (
    <div>
        <div className="App">
          {this.props.children}
        </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading : state.ajaxStatusReducer > 0
  }
};

export default connect(mapStateToProps)(App);
