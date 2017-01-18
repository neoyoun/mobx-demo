require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoadingMask from 'components/LoadingMask';
import VisibilityTypeFilter from 'components/VisibilityTypeFilter';
import MessagesList from 'components/MessagesList';
import AddMessage from 'components/AddMessage';
import UnreadTips from 'components/UnreadTips';
@observer
class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const appState = this.props.appState
    const {showAddNewBox,showTypeFilter,hasUnread,loading,toggleAddBox} = appState
    return (
      <div className='main-container' onClick={e=>this.hidePopupLayer(e)}>
      <DevTools />
        {loading && 
          <LoadingMask />
        }
        <nav className="page-title panel-default">
          <div className="panel-heading">{appState.pageTitle}</div>
          <span className="btn btn-warning add-btn" onClick={ e =>appState.toggleAddBox(e)}>发布</span>
        </nav>
        <div className="messages-list-box" ref="messageBox" onTouchEnd={e=>this.onTouchEndHandle(e)} onWheel={e=>this.onMessagesBoxWheel(e)}>
        <MessagesList messages={appState.showingMessages} userMobile={appState.userMobile}/>
        </div>
        {hasUnread && 
          <UnreadTips clickHandle={this.onRunToButtom}/>
        }
        <VisibilityTypeFilter setVisibleType={type=>appState.setVisibleType(type)} />
        {showAddNewBox && 
          <AddMessage />
        }
      </div>
    );
  }
  componentDidMount() {
    let messageBox = this.refs.messageBox;
    let appState = this.props.appState;
    appState.rollBox = messageBox;
    appState.initialLoad();
  }
  hidePopupLayer(e){
    e.stopPropagation()
    this.props.appState.hidePopupLayer()
  }
  onMessagesBoxWheel(e){
    e.stopPropagation()
    this.props.appState.onMessagesBoxWheel(e)
  }
  onTouchEndHandle(e) {
    e.stopPropagation()
    this.props.appState.onMessagesBoxWheel(e)
  }
  onRunToButtom = (e) => {
    e.stopPropagation()
    this.props.appState.runToBottom();
  }
};

export default App;
