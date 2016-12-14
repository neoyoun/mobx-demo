require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoadingMask from 'components/LoadingMask';
import MessageTypeFilter from 'components/MessageTypeFilter';
import MessagesList from 'components/MessagesList';
import AddMessage from 'components/AddMessage';
@observer
class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
    let appState = this.props.appState;
    let isVisible = appState.showTypeFilter;
    let filterStyle = {
      display:isVisible?'':'none'
    }
    let unReadTips = appState.hasUnread;
        unReadTips = unReadTips?' on':'';
    return (
      <div className='main-container' onClick={this.hideTypeFilter}>
      <DevTools />
        <LoadingMask isVisible={appState.loading}/>
        <nav className = "page-title panel-info">
          <div className ="panel-heading">{appState.pageTitle}</div>
          <span className="filter-btn text-success" onClick={(e)=>appState.toggleTypeFilter(e)}>筛选</span>
        </nav>
        <MessageTypeFilter appState={appState}/>
        <div className="messages-list-box" ref="messageBox" onTouchEnd={this.onTouchEndHandle} onWheel={this.onMessagesBoxWheel}>
        <MessagesList messages={appState.showingMessages} userMobile={appState.userMobile}/>
        </div>
        <div className={"unread-tips"+unReadTips} onClick={this.onRunToButtom}>有新消息</div>
        <AddMessage/>
      </div>
    );
  }
  componentDidMount() {
    let messageBox = this.refs.messageBox;
    let appState = this.props.appState;
    appState.rollBox = messageBox;
    appState.initialLoad();
  }
  hideTypeFilter = (e) => {
    let isVisible = this.props.appState.showTypeFilter;
    if(isVisible) {
      this.props.appState.hideTypeFilter();
    }
  }
  setType = (e) => {
    this.props.appState.setVisibleType(e.target.value)
  }
  onMessagesBoxWheel = (e) => {
    e.stopPropagation()
    this.props.appState.onMessagesBoxWheel(e)
  }
  onTouchEndHandle = (e) => {
    e.stopPropagation()
    this.props.appState.onMessagesBoxWheel()
  }
  onRunToButtom = (e) => {
    e.stopPropagation()
    this.props.appState.runToBottom();
  }
};

export default App;
