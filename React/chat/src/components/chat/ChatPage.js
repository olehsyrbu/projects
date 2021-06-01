import React from 'react';
import PropTypes from 'prop-types';
import * as chatActions from '../../actions/chatActions';
import {connect} from 'react-redux';

class ChatPage extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  componentDidMount() {
    this.props.fetchChatData();
  }

  render(){
    return (
      <div>
        Chat
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    chat: state.chat
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchChatData: (params) => dispatch(chatActions.fetchChatData(params))
});

export default connect(mapStateToProps,mapDispatchToProps)(ChatPage);
